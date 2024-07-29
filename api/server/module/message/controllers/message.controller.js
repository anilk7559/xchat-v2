const Joi = require('joi');
const _ = require('lodash');
const Queue = require('../queue');

/**
 * Create a new media message
 */
exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      text: Joi.string().allow(null, '').optional(),
      fileIds: Joi.array().allow(null).optional(),
      conversationId: Joi.string().required(),
      type: Joi.string().allow('text', 'photo', 'video', 'file').required(),
      price: Joi.number().min(0).optional(), // Add price validation
      socketId: Joi.string().allow(null, '').optional()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    if ((!validate.value.fileIds || !validate.value.fileIds.length) && !validate.value.text) {
      return next(PopulateResponse.error({ message: 'Message must not be empty' }));
    }

    const conversation = await DB.Conversation.findOne({
      _id: validate.value.conversationId,
      isActive: true
    }).populate('members');
    if (!conversation) {
      return next(PopulateResponse.notFound({ message: 'Conversation not found' }));
    }

    if (req.user.type !== 'model') {
      // check spam message
      const checkSpam = await Service.Message.checkSpam({
        conversationId: validate.value.conversationId,
        userId: _.find(conversation.memberIds, (member) => member.toString() !== req.user._id.toString())
      });
  
      if (!checkSpam) {
        return next(PopulateResponse.error({ message: 'Please wait for your Model to reply' }));
      }
    }

    const recipientId = _.find(conversation.memberIds, (member) => member.toString() !== req.user._id.toString());
    const recipient = await DB.User.findOne({ _id: recipientId });
    if (!recipient) {
      return next(PopulateResponse.notFound({ message: 'Recipient is not found' }));
    }
    if (!recipient.isActive) {
      return next(PopulateResponse.error({ message: 'Cannot send message, this profile has been deactivated!' }));
    }

    // check user token is available when user sends message to model
    if (recipient.type === 'model' && recipient?.tokenPerMessage > req.user?.balance) {
      return next(PopulateResponse.error({ message: 'Token is not enough' }));
    }

    const messageData = Object.assign(validate.value, { senderId: req.user._id, recipientId });
    const message = new DB.Message(messageData);
    await message.save();

    // Populate media data
    if (message.type !== 'text' && message.fileIds && message.fileIds.length > 0) {
      const files = await DB.Media.find({ _id: { $in: message.fileIds } });
      if (files && files.length > 0) {
        message.files = files;
      }
    }

    // Emit socket event and update conversation last message data
    Queue.notifyAndUpdateRelationData(message, { socketId: validate.value?.socketId || null });

    // Update conversation meta data for request user
    await Service.Message.readMessage({ conversationId: validate.value.conversationId, userId: req.user._id });

    // Update earning data
    const EarningData = { type: 'send_message' };
    if (req.user.type === 'user') {
      await Service.Earning.create(
        Object.assign(EarningData, {
          userId: req.user._id,
          modelId: _.find(conversation.memberIds, (member) => member.toString() !== req.user._id.toString()),
          itemId: message._id
        }),
        // Do not charge user until model replied
        'pending'
      );
    } else {
      const userId = _.find(conversation.memberIds, (member) => member.toString() !== req.user._id.toString());
      await Service.Earning.approvePendingItemWhenModelRespondMessage(userId, req.user._id);
    }

    const newMessage = message.toObject();
    newMessage.sender = req.user.getPublicProfile();
    newMessage.recipient = recipient.getPublicProfile();
    res.locals.create = newMessage;
    return next();
  } catch (e) {
    return next(e);
  }
};


/**
 * get list message by conversation id
 */
exports.search = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    const query = Object.assign(Helper.App.populateDbQuery(req.query, { text: ['text'] }), {
      conversationId: req.params.conversationId
    });
    const count = await DB.Message.count(query);
    const items = await DB.Message.find(query)
      .populate('sender')
      .populate('recipient')
      .populate('files')
      .sort({ createdAt: -1 })
      .skip(page * take)
      .limit(take)
      .exec();
    const messageIds = items.map((item) => item._id);
    const bookmarks = await DB.BookmarkMessage.find({
      messageId: { $in: messageIds },
      userId: req.user._id
    });
    const updateFiles = async () => {
      for (const item of items) {
        for (const file of item.files) {
          const purchaseExists = await DB.PurchaseItem.exists({ mediaId: file._id });
    
          const sellItemExists = await DB.SellItem.findOne({ mediaId: file._id, folderId: file._id });
          if (!sellItemExists) {
            file.isFree = true; // Set isFree to true if no SellItem exists
          } else {
            file.isFree = false; // Set isFree to false if SellItem exists
            file.sellItemId = sellItemExists._id; // Assign sellItemId if SellItem exists
            file.price = sellItemExists.price; 
          }
    
          file.isPurchased = !!purchaseExists;
          file.purchasedItem = null;
    
          await file.save();
        }
      }
    };
    
    await updateFiles();
    
    res.locals.search = {
      count,
      items: items.map((item) => {
        const bookmark = bookmarks.find((b) => b.messageId.toString() === item._id.toString());
        const data = item.toObject();
        data.sender = item?.sender.getPublicProfile();
        data.bookmarked = !!bookmark;
        data.bookmarkId = bookmark && bookmark.id;
        return data;
      })
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const message = await DB.Message.findOne({ _id: req.params.messageId });
    if (!message) {
      return next(PopulateResponse.notFound());
    }

    // if (req.user.role !== 'admin' && message.senderId.toString() !== req.user._id.toString()) {
    //   return next(PopulateResponse.forbidden());
    // }

    await message.remove();
    await Service.Message.removeRelatedData(message);
    res.locals.remove = PopulateResponse.success({ message: 'Remove message is successfully!' }, 'MESSAGE_REMOVED');
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.latest = async (req, res, next) => {
  try {
    const conversations = await DB.Conversation.find({
      memberIds: {
        $in: [req.user._id]
      },
      lastMessageId: {
        $ne: null
      }
    });
    if (!conversations.length) {
      res.locals.latest = [];
      return next();
    }

    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = {
      conversationId: {
        $in: conversations.map((conversation) => conversation._id)
      },
      senderId: {
        $ne: req.user._id
      }
    };
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Message.count(query);
    const items = await DB.Message.find(query)
      .populate('sender')
      .populate('files')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.latest = {
      count,
      items: items.map((item) => {
        const data = item.toObject();
        data.sender = item.sender ? item.sender.getPublicProfile(true) : null;
        return data;
      })
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.allMessage = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    let query = {};
    const arrId = [];
    if (req.query.modelId && req.query.userId) {
      arrId.push(req.query.modelId, req.query.userId);
      const conversation = await DB.Conversation.findOne({
        memberIds: {
          $all: arrId
        }
      });

      if (!conversation) {
        return next(PopulateResponse.notFound());
      }
      query = {
        conversationId: conversation._id
      };
    } else if (req.query.modelId || req.query.userId) {
      if (req.query.modelId) {
        arrId.push(req.query.modelId);
      }
      if (req.query.userId) {
        arrId.push(req.query.userId);
      }
      query = {
        senderId: {
          $in: arrId
        }
      };
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Message.count(query);
    const items = await DB.Message.find(query)
      .populate('sender')
      .populate('files')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.all = {
      count,
      items: items.map((item) => {
        const data = item.toObject();
        data.sender = item.sender ? item.sender.getPublicProfile(true) : null;
        return data;
      })
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.bookmark = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      messageId: Joi.string().required()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const message = await DB.Message.findOne({ _id: req.body.messageId });
    if (!message) {
      return next(PopulateResponse.notFound('Message not found'));
    }

    const conversation = await DB.Conversation.findOne({ _id: message.conversationId });
    if (!conversation) {
      return next(PopulateResponse.notFound('Conversation not found'));
    }

    if (!_.find(conversation.memberIds, (member) => member.toString() === req.user._id.toString())) {
      return next(PopulateResponse.forbidden());
    }

    let bookmark = await DB.BookmarkMessage.findOne({
      user: req.user._id,
      messageId: req.body.messageId
    });
    if (bookmark) {
      return next(PopulateResponse.error('Bookmarked already'));
    }

    bookmark = await DB.BookmarkMessage.create({
      userId: req.user._id,
      type: message.type,
      messageId: req.body.messageId,
      conversationId: message.conversationId,
      metadata: {
        text: message.text,
        type: message.type,
        recipientId: message.recipientId,
        senderId: message.senderId,
        fileIds: message.fileIds,
      }
    });

    res.locals.bookmark = bookmark;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.unbookmark = async (req, res, next) => {
  try {
    const bookmark = await DB.BookmarkMessage.findOne({ _id: req.params.bookmarkId });
    if (!bookmark) {
      return next(PopulateResponse.notFound('not found'));
    }

    if (bookmark.userId.toString() !== req.user._id.toString()) {
      return next(PopulateResponse.forbidden());
    }

    await bookmark.remove();

    res.locals.bookmark = PopulateResponse.success({ message: 'Remove bookmark is successfully!' }, 'BOOKMARK_MESSAGE_REMOVED');
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.searchBookmarkMessage = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    const query = Object.assign(Helper.App.populateDbQuery(req.query), {
      userId: req.user._id
    });
    if (req.query.type) query.type = req.query.type;
    const count = await DB.BookmarkMessage.count(query);
    const items = await DB.BookmarkMessage.find(query)
      .populate('user')
      .populate('message')
      .populate('conversation')
      .populate('files')
      .populate('recipients')
      .populate('sender')
      .sort({ createdAt: -1 })
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.search = {
      count,
      items: items.map((item) => {
        const data = item.toObject();
        data.user = item?.user?.getPublicProfile();
        data.recipients = item?.recipients?.map((value) => value.getPublicProfile());
        data.sender = item?.sender?.map((value) => value.getPublicProfile());
        return data;
      })
    };
    next();
  } catch (e) {
    next(e);
  }
};
