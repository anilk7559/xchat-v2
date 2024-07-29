const Joi = require('joi');

const validateSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  target: Joi.string().required(),
  targetId: Joi.string().required()
}).unknown();

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.reportId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const abuseReport = await DB.AbuseReport.findOne({ _id: id });
    if (!abuseReport) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.abuseReport = abuseReport;
    res.locals.abuseReport = abuseReport;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const abuseReport = new DB.AbuseReport(Object.assign(validate.value, {
      reporterId: req.user._id
    }));
    await abuseReport.save();
    res.locals.abuseReport = abuseReport;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    if (!['awaiting', 'rejected'].includes(req.body.status)) {
      return res.status(400).send({
        msg: 'Invalid status'
      });
    }

    req.abuseReport.status = req.body.status;
    await req.abuseReport.save();
    res.locals.update = req.abuseReport;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.abuseReport.remove();

    // TODO - send mail to user

    next();
  } catch (e) {
    next(e);
  }
};

/**
 * get list reports
 */
exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query);
    const sort = Helper.App.populateDBSort(req.query);

    const count = await DB.AbuseReport.count(query);
    const items = await DB.AbuseReport.find(query)
      .collation({ locale: 'en' })
      .sort(sort).skip(page * take)
      .limit(take)
      .exec();

    // map user info
    const userIds = items.map((item) => item.reporterId);
    if (!userIds.length) {
      res.locals.list = { count, items };
      return next();
    }

    const users = await DB.User.find({
      _id: {
        $in: userIds
      }
    });
    const results = items.map((item) => {
      const obj = item.toObject();
      const user = users.find((u) => u._id.toString() === item.reporterId.toString());
      obj.repoter = user.getPublicProfile();
      return obj;
    });

    res.locals.list = { count, items: results };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.myList = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query);
    const sort = Helper.App.populateDBSort(req.query);
    query.reporterId = req.user._id;

    const count = await DB.AbuseReport.count(query);
    const items = await DB.AbuseReport.find(query)
      .collation({ locale: 'en' })
      .sort(sort).skip(page * take)
      .limit(take)
      .exec();

    res.locals.list = { count, items };
    next();
  } catch (e) {
    next(e);
  }
};
