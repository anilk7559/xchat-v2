/* eslint no-param-reassign: 0 */
const Joi = require('joi');
const _ = require('lodash');

exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      userId: Joi.string().required()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    if (req.user._id.toString() === validate.value.userId.toString()) {
      return next(PopulateResponse.error({ message: 'Can not add favorite yourself' }));
    }

    // ? Model can not add Model and vice versa
    // const checkType = await DB.User.count({ _id: validate.value.userId, type: { $eq: req.user.type } });
    // if (checkType) {
    //   return next(PopulateResponse.error({ message: 'You can not add other ' + req.user.type }));
    // }

    const count = await DB.Contact.count({ userId: validate.value.userId, addedBy: req.user._id });
    if (count) {
      return next(PopulateResponse.error({ message: 'You have already added the contact' }));
    }

    const contact = new DB.Contact({ userId: validate.value.userId, addedBy: req.user._id });

    await contact.save();

    res.locals.contact = contact;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * get list contact
 */
exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    let take = parseInt(req.query.take, 10) || 10;
    if (take > 100) take = 100;
    const sort = Helper.App.populateDBSort(req.query);
    const query = {
      $or: [{ addedBy: req.user._id }, { userId: req.user._id }]
    };
    const count = await DB.Contact.count(query);
    const contacts = await DB.Contact.find(query)
      .populate('user')
      .populate('added')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    if (!contacts || !contacts.length) {
      res.locals.list = {
        items: [],
        count: 0
      };
      return next();
    }
    if (req.query.username) {
      const re = new RegExp(`\\S*${req.query.username}`, 'i');
      res.locals.list = {
        items: contacts.filter((item) => item.user.username.match(re) || item.added.username.match(re))
      };
      return next();
    }

    res.locals.list = {
      count,
      items: contacts
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.sync = async (req, res, next) => {
  try {
    const count = await DB.User.count({ phoneNumber: { $in: req.body.phoneNumbers } });
    if (!count) {
      res.locals.sync = { items: [] };
      return next();
    }

    const friends = await DB.User.find({ phoneNumber: { $in: req.body.phoneNumbers } });
    const availableFriends = friends.filter((f) => f.type !== req.user.type);
    const availableFriendIds = availableFriends.map((f) => f._id);
    const query = {
      $or: [
        {
          addedBy: { $in: availableFriendIds },
          userId: req.user._id
        },
        {
          userId: { $in: availableFriendIds },
          addedBy: req.user._id
        }
      ]
    };
    const contacts = await DB.Contact.find(query);
    const recipientIds = contacts.map((contact) => (req.user._id.toString() === contact.userId.toString() ? contact.addedBy : contact.userId));
    const items = await Promise.all(
      availableFriends.map((user) => {
        const data = user.getPublicProfile();
        return { ...data, added: _.findIndex(recipientIds, (r) => r.toString() === user._id.toString()) > -1 };
      })
    );

    res.locals.sync = {
      items
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const contact = await DB.Contact.findOne({
      $or: [
        { userId: req.user._id, addedBy: req.params.userId },
        { userId: req.params.userId, addedBy: req.user._id }
      ]
    });
    if (!contact) {
      return next(PopulateResponse.notFound());
    }

    // ? deactive conversation
    // const conservation = await DB.Conversation.findOne({
    //   memberIds: { $all: [req.user._id, req.params.userId] }
    // });
    // if (conservation) {
    //   conservation.isActive = false;
    //   await conservation.save();
    // }
    // ? --- end ---

    await contact.remove();
    res.locals.remove = { success: true, contact };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.find = async (req, res, next) => {
  try {
    const contact = await DB.Contact.findOne({
      _id: Helper.App.toObjectId(req.params.id),
      $or: [
        {
          userId: req.user._id
        },
        {
          addedBy: req.user._id
        }
      ]
    });

    if (!contact) {
      return next(PopulateResponse.notFound());
    }

    const userId = [contact.userId, contact.addedBy].find((u) => u.toString() !== req.user._id.toString());
    const user = await DB.User.findOne({
      _id: userId
    });
    contact.user = user.getPublicProfile();
    res.locals.find = contact;
    return next();
  } catch (e) {
    return next(e);
  }
};
