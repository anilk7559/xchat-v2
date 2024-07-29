const Joi = require('joi');
const SYSTEM_CONST = require('../../system/constants');

exports.sendEmail = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      subject: Joi.string().required(),
      content: Joi.string().allow(null, '').optional(),
      userType: Joi.string().allow(null, '').optional()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    await Service.Newsletter.sendMail(validate.value);
    res.locals.sendEmail = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.inviteUser = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      emails: Joi.required()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const siteName = await DB.Config.findOne({ key: SYSTEM_CONST.SITE_NAME });
    if (!siteName || !siteName.value) {
      return next(PopulateResponse.serverError({ msg: 'Missing site name!' }));
    }

    await Service.Newsletter.inviteUser(
      Object.assign(validate.value, { type: req.user?.type, siteName: siteName.value })
    );
    res.locals.inviteUser = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};
