// todo - check requestToTime, paypal, total, commision, balance
const Joi = require('joi');
const _ = require('lodash');
const SYSTEM_CONST = require('../../system/constants');

exports.list = async (req, res, next) => {
  try {
    if (req.user.type === 'user' && req.user.role !== 'admin') {
      return next(PopulateResponse.unauthenticated());
    }

    const page = Math.max(0, req.query.page - 1) || 0;
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      equal: req.user.role === 'admin' ? ['modelId', 'status'] : ['status']
    });
    if (req.user.role !== 'admin') {
      query.modelId = req.user._id;
    }

    if (req.query.q) {
      const friends = await DB.User.find({
        username: { $regex: req.query.q.trim(), $options: 'i' },
        type: 'model'
      });
      const friendIds = friends.map((friend) => friend._id);
      const tokenRequest = Number(req.query.q);

      query.$or = [{ modelId: { $in: friendIds } }, { tokenRequest }];
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.PayoutRequest.count(query);
    const items = await DB.PayoutRequest.find(query)
      .populate('model')
      .collation({ locale: 'en' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    res.locals.list = { count, items };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.request = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      token: Joi.number().min(0).required()
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (!req.user.type === 'user' && req.user.role !== 'admin') {
      return next(PopulateResponse.forbidden());
    }

    const payoutAccount = await DB.PayoutAccount.findOne({ modelId: req.user._id });

    if (!payoutAccount) {
      return next(PopulateResponse.notFound({ message: 'Please add payout account to send request' }));
    }

    const minPayoutRequest = await DB.Config.findOne({ key: SYSTEM_CONST.MIN_PAYOUT_REQUEST });
    if (!minPayoutRequest || !minPayoutRequest.value) {
      return PopulateResponse.serverError({ message: 'Missing min payout request!' });
    }

    if (validate.value.token < Number(minPayoutRequest.value)) {
      return next(
        PopulateResponse.error({ message: `Minimum payout request is ${Number(minPayoutRequest.value)} tokens` })
      );
    }

    const requestData = {
      modelId: req.user._id,
      payoutAccountId: payoutAccount._id,
      tokenRequest: validate.value.token,
      payoutAccount: _.pick(payoutAccount, ['bankInfo', 'email', 'type'])
    };
    const payoutRequest = new DB.PayoutRequest(requestData);

    await payoutRequest.save();
    payoutRequest.model = req.user;
    await DB.User.update(
      { _id: req.user._id },
      {
        $inc: { balance: -1 * validate.value.token }
      }
    );

    res.locals.request = payoutRequest;
    return next();
  } catch (e) {
    return next(e);
  }
};

// Not use anymore
exports.update = async (req, res, next) => {
  try {
    if (req.user.type === 'user') {
      return next(PopulateResponse.unauthenticated());
    }

    const schema = Joi.object().keys({
      paypal: Joi.string().email().required()
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const payoutRequest = await DB.PayoutRequest.findOne({
      _id: Helper.App.toObjectId(req.params.id),
      modelId: req.user._id
    });
    if (!payoutRequest) {
      return next(PopulateResponse.notFound());
    }

    _.merge(payoutRequest, validate.value);
    await payoutRequest.save();
    res.locals.update = payoutRequest;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.paid = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(PopulateResponse.forbidden());
    }

    const schema = Joi.object().keys({
      note: Joi.string().allow(null, '').optional()
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const payoutRequest = await DB.PayoutRequest.findOne({
      _id: Helper.App.toObjectId(req.params.id)
    });
    if (!payoutRequest) {
      return next(PopulateResponse.notFound());
    }

    if (payoutRequest.status === 'paid') {
      return next(
        PopulateResponse.error({
          message: 'Payout request is paid'
        })
      );
    }

    await DB.Earning.updateMany(
      {
        status: 'requesting',
        requestId: payoutRequest._id
      },
      {
        $set: {
          status: 'paid'
        }
      }
    );

    payoutRequest.status = 'paid';
    payoutRequest.note = validate.value.note;
    await payoutRequest.save();
    res.locals.paid = {
      success: true,
      action: 'paid'
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const payoutRequest = await DB.PayoutRequest.findOne({
      _id: Helper.App.toObjectId(req.params.id)
    });

    if (!payoutRequest) {
      return next(PopulateResponse.notFound());
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== payoutRequest.modelId.toString()) {
      return next(PopulateResponse.forbidden());
    }

    await payoutRequest.remove();
    res.locals.remove = {
      success: true
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const payoutRequest = await DB.PayoutRequest.findOne({
      _id: Helper.App.toObjectId(req.params.id)
    }).populate('model');

    if (!payoutRequest) {
      return next(PopulateResponse.notFound());
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== payoutRequest.modelId.toString()) {
      return next(PopulateResponse.forbidden());
    }

    res.locals.findOne = payoutRequest;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.approve = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(PopulateResponse.forbidden());
    }

    const schema = Joi.object().keys({
      note: Joi.string().allow(null, '').optional()
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const payoutRequest = await DB.PayoutRequest.findOne({
      _id: Helper.App.toObjectId(req.params.id)
    });
    if (!payoutRequest) {
      return next(PopulateResponse.notFound());
    }

    if (payoutRequest.status === 'approved') {
      return next(
        PopulateResponse.error({
          message: 'Payout request is approved'
        })
      );
    }

    payoutRequest.status = 'approved';
    payoutRequest.note = validate.value.note;
    await payoutRequest.save();
    res.locals.approve = { success: true, action: 'approved' };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.reject = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(PopulateResponse.forbidden());
    }

    const schema = Joi.object().keys({
      note: Joi.string().allow(null, '').optional()
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const payoutRequest = await DB.PayoutRequest.findOne({
      _id: Helper.App.toObjectId(req.params.id)
    });
    if (!payoutRequest) {
      return next(PopulateResponse.notFound());
    }

    if (payoutRequest.status === 'rejected') {
      return next(
        PopulateResponse.error({
          message: 'Payout request is rejected'
        })
      );
    }

    payoutRequest.status = 'rejected';
    payoutRequest.note = validate.value.note;
    await payoutRequest.save();
    await DB.User.update(
      { _id: payoutRequest.modelId },
      {
        $inc: {
          balance: payoutRequest.tokenRequest
        }
      }
    );
    res.locals.reject = { success: true, action: 'rejected' };
    return next();
  } catch (e) {
    return next(e);
  }
};
