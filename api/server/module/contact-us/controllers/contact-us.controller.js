const Joi = require('joi');

exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      message: Joi.string().required()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const adminEmail = await DB.Config.findOne({ key: 'adminEmail' });
    if (adminEmail) {
      await Service.Mailer.send('contact-us.html', adminEmail.value, {
        subject: 'Contact form',
        content: req.body
      });
    }
    next();
  } catch (e) {
    return next(e);
  }
  return next();
};
