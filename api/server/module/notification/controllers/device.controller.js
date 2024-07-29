const Joi = require('joi');

const validateSchema = Joi.object().keys({
  os: Joi.string()
    .valid('ios', 'android')
    .required(),
  identifier: Joi.string().required()
});

/**
 * Add new mobile device
 */
exports.add = async (req, res, next) => {
  try {
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    await DB.Device.remove({
      userId: req.user._id,
      os: validate.value.os
    });

    const device = new DB.Device(Object.assign(validate.value, { userId: req.user._id }));
    await device.save();
    res.locals.device = device;
    return next();
  } catch (e) {
    return next(e);
  }
};

const schema = Joi.object().keys({
  os: Joi.string()
    .valid('ios', 'android')
    .required()
});
exports.remove = async (req, res, next) => {
  try {
    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    await DB.Device.remove({
      userId: req.user._id,
      os: validate.value.os
    });
    res.locals.remove = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};
