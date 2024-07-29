const Joi = require('joi');

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.itemId;
    if (!id) {
      return next(PopulateResponse.notFound());
    }
    const item = await DB.PurchaseItem.findOne({ _id: id }).populate('media');

    if (!item) {
      return next(PopulateResponse.notFound({ message: 'Purchase item is not found' }));
    }
    item.media = await Service.Media.populateAuthRequest({ media: item.media, user: req.user });
    req.purchaseItem = item;
    res.locals.findOne = item;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.purchase = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      sellItemId: Joi.string().required()
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    // if (req.user.type !== 'user') {
    //   return next(PopulateResponse.forbidden());
    // }

    const options = Object.assign(validate.value, { user: req.user });
    const purchaseItem = await Service.Purchase.createPurchaseItem(options);

    res.locals.purchase = purchaseItem;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.myPurchaseItem = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    const sort = Helper.App.populateDBSort(req.query);
    const query = {
      userId: req.user._id,
      deleted: {
        $ne: true
      }
    };
    if (req.query.type) query.mediaType = req.query.type;
    const count = await DB.PurchaseItem.count(query);
    const items = await DB.PurchaseItem.find(query)
      .populate('media')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    await Promise.all(items.map(async (item) => {
      // eslint-disable-next-line no-param-reassign
      item.media = item.media ? await Service.Media.populateAuthRequest({ media: item.media, user: req.user }) : {};
      return item;
    }));
    res.locals.myPurchaseItem = {
      count,
      items
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.download = async (req, res, next) => {
  try {
    const purchaseObj = req.purchaseItem.toObject();

    if (!purchaseObj || !purchaseObj.media || !purchaseObj.mediaId) {
      return next(PopulateResponse.notFound());
    }
    if (req.user._id.toString() !== purchaseObj.userId.toString()) {
      return next(PopulateResponse.forbidden());
    }

    const fileName = purchaseObj.media.fileUrl.slice(purchaseObj.media.fileUrl.indexOf('/photos/') + 8);
    res.locals.download = { href: purchaseObj.media.fileUrl, fileName };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const purchaseObj = req.purchaseItem.toObject();
    if (req.user._id.toString() !== purchaseObj.userId.toString()) {
      return next(PopulateResponse.forbidden());
    }
    if (purchaseObj.deleted) return next();
    await Service.Purchase.delete(purchaseObj._id);
    res.locals.delete = {
      success: true
    };
    return next();
  } catch (e) {
    return next();
  }
};
