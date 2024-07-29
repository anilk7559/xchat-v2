const Joi = require('joi');
const _ = require('lodash');

exports.createAndUpdate = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      type: Joi.string().required(),
      email: Joi.string().email().allow('', null).optional(),
      bankInfo: Joi.object({
        bankName: Joi.string().optional(),
        bankAddress: Joi.string().optional(),
        iban: Joi.string().optional(),
        swift: Joi.string().optional(),
        beneficiaryName: Joi.string().optional(),
        beneficiaryAddress: Joi.string().optional()
      })
        .allow({}, null)
        .optional(),
      modelId: Joi.string().allow('', null).optional()
    });

    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (req.user.role === 'admin' && !validate.value.modelId) {
      return next(PopulateResponse.error({ msg: 'Missing model Id' }));
    }
    const query = {
      modelId: req.user.role === 'admin' ? validate.value.modelId : req.user._id
    };
    const account = await DB.PayoutAccount.findOne(query);
    if (account) {
      // update payout account
      _.merge(account, validate.value);
      await account.save();
      res.locals.data = account;
    } else {
      // create new payout account
      const newAccount = new DB.PayoutAccount(
        _.merge(validate.value, { modelId: validate.value.modelId || req.user._id })
      );
      await newAccount.save();
      res.locals.data = newAccount;
    }
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const account = await DB.PayoutAccount.findOne({
      $or: [{ _id: Helper.App.toObjectId(req.params.id) }, { modelId: req.params.id || req.user._id }]
    }).populate('model');

    if (account && req.user.role !== 'admin' && req.user._id.toString() !== account.modelId.toString()) {
      return next(PopulateResponse.forbidden());
    }

    res.locals.findOne = account || {};
    return next();
  } catch (e) {
    return next(e);
  }
};
