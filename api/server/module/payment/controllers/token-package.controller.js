const _ = require('lodash');
const Joi = require('joi');

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.tokenPackageId || req.body.tokenPackageId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const query = Helper.App.isMongoId(id) ? { _id: id } : { alias: id };
    const tokenPackage = await DB.TokenPackage.findOne(query);
    if (!tokenPackage) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.tokenPackage = tokenPackage;
    res.locals.tokenPackage = tokenPackage;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Create a new token package
 */
exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().allow(null, '').optional(),
      price: Joi.number().required(),
      token: Joi.number().required(),
      ordering: Joi.number().optional()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const tokenPackage = new DB.TokenPackage(validate.value);
    await tokenPackage.save();
    res.locals.create = tokenPackage;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * do update token package
 */
exports.update = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().allow(null, '').optional(),
      price: Joi.number().required(),
      token: Joi.number().required(),
      ordering: Joi.number().optional()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    _.merge(req.tokenPackage, validate.value);
    await req.tokenPackage.save();
    res.locals.update = req.tokenPackage;
    return next();
  } catch (e) {
    return next();
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.tokenPackage.remove();
    res.locals.remove = PopulateResponse.success({ message: 'Package is deleted' }, 'PACKAGE_REMOVED');
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * get list tokenPackage
 */
exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = {};
    if (req.query.q) {
      query.$or = [{ name: { $regex: req.query.q.trim(), $options: 'i' } }];
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.TokenPackage.count(query);
    const items = await DB.TokenPackage.find(query)
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.list = {
      count,
      items
    };
    return next();
  } catch (e) {
    return next(e);
  }
};
