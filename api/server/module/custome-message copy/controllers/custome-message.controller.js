const Joi = require('joi');
const _ = require('lodash');

exports.findOne = async (req, res, next) => {
  try {
    const customMessage = await DB.CustomeMessage.findOne({ _id: req.params.id });
    if (!customMessage) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.customMessage = customMessage;
    res.locals.customMessage = customMessage;
    console.log(customMessage)
    // return res.status(200).send(customMessage);
  //   return res.send({
  //     code: 200,
  //     data: customMessage
  // });
  

    return next();
  } catch (e) {
    return next(e);
  }
};


const validateSchema = Joi.object().keys({
  message: Joi.string().required()
});

exports.create = async (req, res, next) => {
  try {

    const validateSchema = Joi.object().keys({
      // title: Joi.string().required(),
      message: Joi.string().required()
    });

    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const customeMessage = new DB.CustomeMessage(validate.value);
    await customeMessage.save();
    res.locals.customeMessage = customeMessage;
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

    _.assign(req.customMessage, validate.value);
    await req.customMessage.save();
    res.locals.update = req.customMessage;
    return next();
  } catch (e) {
    return next();
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.customMessage.remove();
    res.locals.remove = {
      message: 'custom Message is deleted'
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
    const query = Helper.App.populateDbQuery(req.query);

 
    const count = await DB.CustomeMessage.count(query);
    const items = await DB.CustomeMessage.find(query)
      .collation({ locale: 'en' })
      // .sort(sort).skip(page * take)
      .limit(take)
      .exec();

    res.locals.bannerList = {
      count,
      items
    };
    next();
  } catch (e) {
    next(e);
  }
};

