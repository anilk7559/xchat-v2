const Joi = require('joi');

/**
 * do upload a video
 */
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(PopulateResponse.error({ message: 'Missing video file!' }, 'ERR_MISSING_VIDEO'));
    }

    const schema = Joi.object()
    .keys({
      name: Joi.string().allow('', null).optional(),
      description: Joi.string().allow('', null).optional(),
      price: Joi.number().allow(null).optional(), // Add necessary fields for SellItem
      mediaType: Joi.string().allow(null).optional(),
    })
    .unknown();

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const video = await Service.Media.createVideo({
      value: validate.value,
      user: req.user,
      file: req.file
    });

    const sellItem = new DB.SellItem({
      ownerId: req.user._id,
      mediaId: video._id,
      price: validate.value.price,
      mediaType: validate.value.mediaType,
      name: validate.value.name,
      description: validate.value.description,
      isApproved: false, // Set default approval status
      createdAt: new Date()
    });

    res.locals.video = video;
    res.locals.sellItem = sellItem;
    return next();
  } catch (e) {
    return next(e);
  }
};
