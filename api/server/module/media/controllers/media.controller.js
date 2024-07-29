const Joi = require('joi');
const jwt = require('jsonwebtoken');

/**
 * do upload a photo
 */
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(PopulateResponse.error({ message: 'Missing file!' }, 'ERR_MISSING_FILE'));
    }

    const schema = Joi.object()
      .keys({
        name: Joi.string().allow('', null).optional(),
        description: Joi.string().allow('', null).optional()
      })
      .unknown();

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const file = await Service.Media.createFile({
      value: validate.value,
      user: req.user,
      file: req.file
    });

    res.locals.file = file;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * find media and add to req
 */
exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id
      || req.params.mediaId
      || req.params.photoId
      || req.params.videoId
      || req.body.mediaId
      || req.body.photoId
      || req.body.videoId;
    if (!id) {
      return next(PopulateResponse.notFound());
    }

    const media = await DB.Media.findOne({ _id: id });
    if (!media) {
      return next(PopulateResponse.notFound());
    }
    const data = await Service.Media.populateAuthRequest({ media, user: req.user });

    res.locals.media = data;
    req.media = data;

    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * find media and add to req
 */
exports.search = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  if (req.user.role !== 'admin' && !req.query.ownerId) {
    req.query.ownerId = req.user._id;
  }

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name', 'description'],
      equal: ['type', 'ownerId', 'uploaderId', 'systemType']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Media.count(query);
    const items = await DB.Media.find(query)
      .collation({ locale: 'en' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.search = { count, items };
    next();
  } catch (e) {
    next(e);
  }
};

exports.validatePermission = async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.media.ownerId.toString()) {
    return next(PopulateResponse.forbidden());
  }

  return next();
};

exports.mediaAuth = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      userId: Joi.string().required(),
      mediaId: Joi.string().required(),
      access_token: Joi.string().required()
    });
    const validate = validateSchema.validate(req.query);

    try {
      const decoded = jwt.verify(req.query.access_token, process.env.SESSION_SECRET);
      if (decoded._id !== validate.value.userId) {
        return next(PopulateResponse.notFound({ message: 'Invalid request' }));
      }
    } catch (e) {
      return next(PopulateResponse.notFound({ message: 'Invalid request' }));
    }

    const user = await DB.User.findOne({ _id: validate.value.userId });
    if (!user || !user.isActive) {
      return next(PopulateResponse.notFound({ message: 'User is not found' }));
    }

    const media = await DB.Media.findOne({ _id: validate.value.mediaId });
    if (!media) {
      return next(PopulateResponse.notFound({ message: 'The file is not found' }));
    }

    if (user.role !== 'admin' && user._id.toString() !== media.ownerId.toString()) {
      // ?check - is purchase media?
      if (media.systemType === 'sell-item') {
        const isPurchase = await DB.PurchaseItem.count({ mediaId: media._id, userId: validate.value.userId });
        if (!isPurchase) {
          return next(PopulateResponse.forbidden({ message: `Please purchase the ${media.type} to access` }));
        }
      }
      // ?check - is user in the conversation which have this media?
      if (media.systemType === 'message') {
        const message = await DB.Message.findOne({ fileIds: { $in: [media._id] } });
        if (!message) {
          return next(PopulateResponse.notFound({ message: 'Message is not found' }));
        }
        const conversation = await DB.Conversation.count({
          _id: message.conversationId,
          memberIds: { $in: [validate.value.userId] }
        });
        if (!conversation) {
          return next(
            PopulateResponse.forbidden({ message: `You do not have permission to access this ${media.type}` })
          );
        }
      }
    }
    res.locals.protected = PopulateResponse.fetchSuccess();
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.download = async (req, res, next) => {
  try {
    const media = req.media;
    if (!media.fileUrl) {
      return next(PopulateResponse.notFound({ message: 'Can\'t find the file!' }));
    }
    res.locals.download = {
      href: media.fileUrl,
      fileName: media.name 
    };
    return next();
  } catch (e) {
    return next(e);
  }
};
