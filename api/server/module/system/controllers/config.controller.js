const _ = require('lodash');
const Joi = require('joi');
const Image = require('../../media/components/image');

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.configId || req.body.configId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const config = await DB.Config.findOne({ _id: id });
    if (!config) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.config = config;
    res.locals.config = config;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * do update
 */
exports.update = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      value: Joi.any().required()
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    _.assign(req.config, req.body);
    await req.config.save();
    res.locals.update = req.config;
    return next();
  } catch (e) {
    return next();
  }
};

/**
 * get list config
 */
exports.list = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.group) {
      query.group = req.query.group;
    }
    const items = await DB.Config.find(query).exec();

    res.locals.configs = items;
    next();
  } catch (e) {
    next();
  }
};

exports.publicConfig = async (req, res, next) => {
  try {
    const items = await DB.Config.find({
      public: true,
      autoload: true
    }).exec();
    const data = {};
    items.forEach((item) => {
      data[item.key] = item.value;
    });

    res.locals.publicConfig = data;
    next();
  } catch (e) {
    next();
  }
};

exports.publicConfigByKeys = async (req, res, next) => {
  try {
    const keys = req.body.keys;
    if (!keys || !Array.isArray(keys)) {
      return next('Invalid request');
    }

    const items = await DB.Config.find({
      public: true,
      key: {
        $in: keys
      }
    }).exec();
    const data = {};
    items.forEach((item) => {
      data[item.key] = item.value;
    });

    res.locals.publicConfig = data;
    return next();
  } catch (e) {
    return next();
  }
};

exports.base64Upload = async (req, res, next) => {
  if (!req.body.base64) {
    return next();
  }

  const data = await Image.saveBase64Image(req.body.base64, req.body);
  req.base64Photo = data;
  return next();
};

/**
 * do upload a photo
 */
exports.upload = async (req, res, next) => {
  try {
    if (!req.file && !req.base64Photo) {
      return next(PopulateResponse.error({ message: 'Missing file!' }, 'ERR_MISSING_FILE'));
    }

    const file = req.file || req.base64Photo;
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

    const photo = await Service.Media.createPhoto({
      value: validate.value,
      user: req.user,
      file
    });

    res.locals.file = photo;
    return next();
  } catch (e) {
    return next(e);
  }
};
