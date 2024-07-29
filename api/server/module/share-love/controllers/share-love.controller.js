const Joi = require('joi');
const moment = require('moment');

exports.create = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      token: Joi.number().required(),
      modelId: Joi.string().required()
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    // ? only user can show love to model
    // if (req.user.type !== 'user') {
    //   return next(PopulateResponse.forbidden());
    // }

    const data = Object.assign(validate.value, { userId: req.user._id });
    const shareLove = await Service.ShareLoveService.createShareLove(data);

    if (shareLove.token > 0) {
      const EarningData = {
        userId: req.user._id,
        modelId: shareLove.modelId,
        type: 'share_love',
        token: shareLove.token,
        itemId: shareLove._id,
        status: 'approved'
      };
      await Service.Earning.create(EarningData);

      await Service.Socket.emitToUsers(shareLove.modelId.toString(), 'share_love_success', {
        userId: req.user._id,
        modelId: shareLove.modelId,
        type: 'share_love',
        token: shareLove.token,
        itemId: shareLove._id,
        status: 'approved',
        username: req.user.username,
        createdAt: new Date()
      });
    }

    res.locals.shareLove = shareLove;
    return next();
  } catch (err) {
    return next(err);
  }
};

function groupBy(array, property, type) {
  return array.reduce((acc, obj) => {
    const key = type === 'monthly' ? moment(obj[property]).format('MMMM YYYY') : moment(obj[property]).format('MMMM Do');
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += 1; // count love
    return acc;
  }, {});
}

exports.count = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      type: Joi.string().allow('daily', 'monthly', '', null).optional()
    });
    const validate = schema.validate(req.query);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    if (req.user.role !== 'admin') {
      return next(PopulateResponse.forbidden());
    }

    const query = {
      createdAt: {
        $gte: moment()
          .startOf(validate.value.type === 'monthly' ? 'year' : 'month')
          .format(),
        $lte: moment()
          .endOf(validate.value.type === 'monthly' ? 'year' : 'month')
          .format()
      }
    };

    const data = await DB.ShareLove.find(query).sort({ createdAt: 1 }).exec();
    const total = await DB.ShareLove.count(query);

    data.map((d) => {
      const item = {
        ...d
      };
      item.createdAt = validate.value.type === 'monthly'
        ? moment(d.createdAt).startOf('month')
        : moment(d.createdAt).startOf('day');
      return item;
    }); // convert create at time to 0

    const group = groupBy(data, 'createdAt', validate.value.type); // group array to object with model id is a key

    res.locals.count = {
      total,
      data: Object.keys(group).map((key) => [key, group[key]])
    };
    return next();
  } catch (err) {
    return next(err);
  }
};
