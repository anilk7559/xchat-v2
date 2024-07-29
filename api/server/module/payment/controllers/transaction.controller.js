const Joi = require('joi');
const _ = require('lodash');

/** Now it only use to buy token package */
exports.request = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      gateway: Joi.string().allow('ccbill').required(),
      service: Joi.string().allow('token_package').required(),
      itemId: Joi.string().required() // base on type, like order id
    });
    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    if (!req.user) {
      return next(PopulateResponse.forbidden());
    }

    const product = await Service.Payment.getProduct(_.omit(validate.value, ['gateway']));

    const paymentData = {
      gateway: validate.value.gateway,
      price: product.price,
      meta: validate.value,
      userId: req.user._id,
      type: validate.value.service || 'token_package',
      description: `Package: ${product.name}`,
      products: {
        id: product._id,
        price: product.price,
        description: product.name
      },
      itemId: product._id
    };

    const data = await Service.Payment.createSinglePayment(paymentData);
    res.locals.request = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.doCCBillCallhook = async (req, res, next) => {
  try {
    const userId = req.body['X-userId'] || req.body.userId;
    const packageId = req.body['X-itemId'] || req.body.itemId;
    const transactionId = req.body['X-transactionId'] || req.body.transactionId;
    if (!transactionId || ['Cancellation', 'RenewalFailure', 'NewSaleFailure'].indexOf(req.query.eventType) > -1) {
      return res.status(200).send({ ok: true });
    }

    const checkForHexRegExp = /^[0-9a-fA-F]{24}$/;
    if (!checkForHexRegExp.test(transactionId)) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    const transaction = await DB.Transaction.findOne({ _id: transactionId }).sort({ createdAt: -1 });
    if (!transaction) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    // updatedTransaction
    if (transaction.status !== 'completed') {
      transaction.status = 'completed';
      transaction.meta = Object.assign(transaction.meta, req.body);
      await transaction.save();
    }

    const invoiceData = transaction.toObject();
    delete invoiceData._id;
    const data = new DB.Invoice(invoiceData);
    data.transactionId = transaction._id;
    await data.save();

    const updateToken = await Service.TokenPackage.updateToken({ userId, packageId });

    await Service.TokenPackage.notifyAndUpdateRelationData({ userId, packageId });
    res.locals.callhook = updateToken;
    return next();
  } catch (e) {
    return next(e);
  }
};
