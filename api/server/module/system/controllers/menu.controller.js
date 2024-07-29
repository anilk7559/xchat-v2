const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  title: Joi.string().required(),
  path: Joi.string().required(),
  internal: Joi.boolean().allow(null).optional(),
  help: Joi.string().allow(null, '').optional(),
  section: Joi.string().allow(null, '').optional(),
  public: Joi.boolean().allow(null).optional(),
  openNewTab: Joi.boolean().allow(null).optional()
}).unknown();

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.menuId || req.body.menuId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const menu = await DB.Menu.findOne({ _id: id });
    if (!menu) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.menu = menu;
    res.locals.menu = menu;
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
    const menu = new DB.Menu(validate.value);
    await menu.save();
    res.locals.menu = menu;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    _.merge(req.menu, validate.value);
    await req.menu.save();
    res.locals.update = req.menu;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.menu.remove();

    res.locals.remove = {
      message: 'Menu is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Menu.count(query);
    const items = await DB.Menu.find(query)
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

exports.publicMenuBySection = async (req, res, next) => {
  try {
    const section = req.params.section;
    const query = {
      public: true,
      section
    };

    const items = await DB.Menu.find(query).sort({ ordering: 1 }).exec();

    res.locals.menus = items.map((item) => _.pick(item, ['_id', 'title', 'path', 'openNewTab']));
    next();
  } catch (e) {
    next(e);
  }
};
