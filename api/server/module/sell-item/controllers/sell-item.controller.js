const Joi = require('joi');
const _ = require('lodash');
const Folder = require('../models/folder');

exports.createSellItem = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      mediaId: Joi.string().allow('', String).optional(),
      price: Joi.number().min(0).allow('', null).optional(),
      free: Joi.boolean().allow('', String).optional(),
      name: Joi.string().min(2).max(500).allow('', String).optional(),
      description: Joi.string().allow('', String).optional(),
      mediaType: Joi.string().allow('photo', 'video').allow('', String).optional(),
      folderId: Joi.string().required(),
      isApproved: Joi.boolean().default(false),
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (req.user.type !== 'model') {
      return next(PopulateResponse.forbidden());
    }
    const media = await DB.Media.findOne({ _id: validate.value.mediaId });
    if (!media) {
      return next(PopulateResponse.notFound());
    }

    const sellItem = new DB.SellItem({
      userId: req.user._id,
      folderId: validate.value.folderId,
      ...validate.value
    });
    await sellItem.save();
    res.locals.create = sellItem;
    return next();
  } catch (error) {
    return next(error);
  }
};


exports.search = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['userId', 'mediaType', 'isApproved']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.SellItem.count(query);
    const items = await DB.SellItem.find(query)
      .populate({
        path: 'media',
        select:
          req.query.userId !== req.user._id.toString()
            ? 'name userId thumbPath blurPath filePath type uploaderId systemType _id'
            : ''
      })
      .populate('model')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    res.locals.search = {
      count,
      items: items.map((item) => {
        const data = item.toObject();
        data.model = item.model ? item.model.getPublicProfile() : {};
        return data;
      })
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      price: Joi.number().min(0).required(),
      free: Joi.boolean().required(),
      name: Joi.string().min(2).max(500).required(),
      description: Joi.string().allow('', String).optional(),
      isApproved: Joi.boolean().optional()
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const newData = req.user.role === 'admin' ? validate.value : _.omit(validate.value, ['isApproved']);
    _.merge(req.sellItem, newData);
    await req.sellItem.save();

    res.locals.update = req.sellItem;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.itemId;
    if (!id) {
      return next(PopulateResponse.notFound());
    }
    let sellItem = null;
    if (req.user.role === 'admin') {
      sellItem = await DB.SellItem.findOne({ _id: id }).populate('media').populate('model');
      sellItem.media = await Service.Media.populateAuthRequest({ media: sellItem.media, user: req.user });
    } else if (req.user.role !== 'admin' && req.user.type === 'model') {
      sellItem = await DB.SellItem.findOne({ _id: id, userId: req.user._id }).populate('media');
      sellItem.media = await Service.Media.populateAuthRequest({ media: sellItem.media, user: req.user });
    } else if (req.user.role !== 'admin' && req.user.type === 'user') {
      sellItem = await DB.SellItem.findOne({ _id: id });
    }

    if (!sellItem) {
      return next(PopulateResponse.notFound());
    }

    res.locals.sellItem = sellItem;
    req.sellItem = sellItem;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const sellItem = await DB.SellItem.findOne({ _id: req.params.itemId });
    if (!sellItem) {
      return next(PopulateResponse.notFound());
    }
    if (req.user.role !== 'admin' && sellItem.userId.toString() !== req.user._id.toString()) {
      return next(PopulateResponse.forbidden());
    }
    await Service.SellItem.checkAndRemoveRelatedData(sellItem);
    await sellItem.remove();

    res.locals.remove = PopulateResponse.success({ message: 'Sell item is removed' }, 'SELL_ITEM_REMOVED');
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.validatePermission = async (req, res, next) => {
  if (
    req.user.role !== 'admin'
    && (req.user.type !== 'model' || req.user._id.toString() !== req.sellItem.userId.toString())
  ) {
    return next(PopulateResponse.forbidden());
  }

  return next();
};

exports.mySellItem = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    if (req.user.type !== 'model') {
      return next(PopulateResponse.forbidden());
    }

    // Fetch folders for the user
    const folders = await Folder.find({ userId: req.user._id }).exec();

    // Fetch SellItems and associated media for each folder
    const foldersWithItems = await Promise.all(
      folders.map(async (folder) => {
        const sellItems = await DB.SellItem.find({
          folderId: folder._id,
          mediaType: req.query.mediaType,
          isApproved: true
        }).populate('media').sort({ createdAt: -1 }).skip(page * take).limit(take).exec();

        return {
          ...folder.toObject(),
          sellItems,
        };
      })
    );

    // Flatten sell items to compute the count
    const allSellItems = foldersWithItems.flatMap(folder => folder.sellItems);
    const count = allSellItems.length;

    // Response structure
    res.locals.mySellItem = {
      count,
      folders: foldersWithItems,
    };
    return next();
  } catch (e) {
    return next(e);
  }
};
//  /pending-videoItem/me

exports.myPendingItem = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    if (req.user.type !== 'model') {
      return next(PopulateResponse.forbidden());
    }

    // Fetch folders for the user
    const folders = await Folder.find({ userId: req.user._id }).exec();

    // Fetch SellItems and associated media for each folder
    const foldersWithItems = await Promise.all(
      folders.map(async (folder) => {
        const sellItems = await DB.SellItem.find({
          folderId: folder._id,
          mediaType: req.query.mediaType,
          isApproved: false
        }).populate('media').sort({ createdAt: -1 }).skip(page * take).limit(take).exec();

        return {
          ...folder.toObject(),
          sellItems,
        };
      })
    );

    // Flatten sell items to compute the count
    const allSellItems = foldersWithItems.flatMap(folder => folder.sellItems);
    const count = allSellItems.length;
   console.log(foldersWithItems, "images");
    // Response structure
    res.locals.myPendingItem = {
      count,
      folders: foldersWithItems,
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.myPendingVideoItem = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    if (req.user.type !== 'model') {
      return next(PopulateResponse.forbidden());
    }

    // Fetch folders for the user
    const folders = await Folder.find({ userId: req.user._id }).exec();

    // Fetch SellItems and associated media for each folder
    const foldersWithItems = await Promise.all(
      folders.map(async (folder) => {
        const sellItems = await DB.SellItem.find({
          folderId: folder._id,
          mediaType: req.query.mediaType,
          isApproved: false
        }).populate('media').sort({ createdAt: -1 }).skip(page * take).limit(take).exec();

        return {
          ...folder.toObject(),
          sellItems,
        };
      })
    );

    // Flatten sell items to compute the count
    const allSellItems = foldersWithItems.flatMap(folder => folder.sellItems);
    const count = allSellItems.length;
    // Response structure
    res.locals.myPendingVideoItem = {
      count,
      folders: foldersWithItems,
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.modelSellItem = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    // if (req.user.type !== 'user') {
    //   return next(PopulateResponse.forbidden());
    // }

    const count = await DB.SellItem.count({
      userId: req.query.modelId,
      mediaType: req.query.mediaType,
      isApproved: true
    });
    const items = await DB.SellItem.find({
      ownerId: req.query.modelId,
      mediaType: req.query.mediaType,
      isApproved: true
    })
      .populate('media')
      .sort({ createdAt: -1 })
      .skip(page * take)
      .limit(take)
      .exec();

    // todo - find and populate purchase item data
    const sellItemIds = items.map((item) => item._id);
    const purchaseItems = await DB.PurchaseItem.find({
      userId: req.user._id,
      sellItemId: {
        $in: sellItemIds
      }
    });
    const data = await Promise.all(items.map((item) => {
      item.set('isPurchased', purchaseItems.find((p) => p.sellItemId.toString() === item._id.toString()) !== undefined);
      item.set(
        'purchasedItem',
        purchaseItems.find((p) => (p.sellItemId.toString() === item._id.toString() ? p : null))
      );

      return item;
    }));

    res.locals.modelSellItem = {
      count,
      items: data
    };
    return next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};


exports.modelSellItems = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    // Retrieve folders for the specified model
    const folders = await Folder.find({ userId: req.query.modelId  || '6683cce9a5e475a6ac5c0731' });
    console.log(folders, "folders");

    // Get count of sell items that are approved
    const count = await DB.SellItem.count({
      userId: req.query.modelId  || '6683cce9a5e475a6ac5c0731',
      mediaType: req.query.mediaType,
      isApproved: true
    });

    // Initialize variables to store results
    let totalPhotoCount = 0;
    let totalVideoCount = 0;
    let photos = [];
    let videos = [];

    const foldersWithImages = await Promise.all(
      folders.map(async (folder) => {
        // Retrieve sell items for each folder
        const sellItems = await DB.SellItem.find({
          folderId: folder._id,
          mediaType: req.query.mediaType,
          isApproved: true
        }).populate('media').sort({ createdAt: -1 }).skip(page * take).limit(take).exec();

        const photoItems = sellItems.filter(item => item.mediaType === 'photo');
        const videoItems = sellItems.filter(item => item.mediaType === 'video');

        photos = [...photos, ...photoItems];
        videos = [...videos, ...videoItems];

        totalPhotoCount += photoItems.length;
        totalVideoCount += videoItems.length;

        // Find and populate purchase item data for each sell item
        const sellItemIds = sellItems.map(item => item._id);
        const purchaseItems = await DB.PurchaseItem.find({
          userId: req.user._id,
          sellItemId: {
            $in: sellItemIds
          }
        });

        const data = sellItems.map(item => {
          item.set('isPurchased', purchaseItems.some(p => p.sellItemId.toString() === item._id.toString()));
          item.set('purchasedItem', purchaseItems.find(p => p.sellItemId.toString() === item._id.toString()));

          return item;
        });

        return {
          ...folder.toObject(),
          sellItems: data,
        };
      })
    );

    res.locals.modelSellItem = {
      count,
      folders: foldersWithImages,
      totalPhotoCount,
      totalVideoCount
    };
    return next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};




// blogs posts 
exports.createBlogPost = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      mediaId: Joi.string().allow('', String).optional(),
      name: Joi.string().min(2).max(500).allow('', String).optional(),
      description: Joi.string().allow('', String).optional(),
      mediaType: Joi.string().allow('photo', 'video').allow('', String).optional(),
      type: Joi.string().allow('blog', 'post').allow('', String).optional(),
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (req.user.type !== 'model') {
      return next(PopulateResponse.forbidden());
    }
    const media = await DB.Media.findOne({ _id: validate.value.mediaId });
    if (!media) {
      return next(PopulateResponse.notFound());
    }

    const blogItem = new DB.SellItem({
      userId: req.user._id,
      type: "blog",
      ...validate.value
    });
    await blogItem.save();
    res.locals.createBlogPost = blogItem;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return next(PopulateResponse.validationError({ message: 'User ID is required' }));
    }
    const blogs = await DB.SellItem.find({ userId, type: "blog" }).populate('media');
    if (!blogs.length) {
      return next(PopulateResponse.notFound());
    }
    res.json({
      code: 200,
      message: 'OK',
      data: blogs
    });
  } catch (error) {
    return next(error);
  }
};



exports.getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(PopulateResponse.validationError({ message: 'Blog ID is required' }));
    }

    const blog = await DB.SellItem.findById(id).populate('media');
    if (!blog) {
      return next(PopulateResponse.notFound());
    }

    res.json({
      code: 200,
      message: 'OK',
      data: blog
    }); 
    // return next();
  } catch (error) {
    return next(error);
  }
};

exports.test = async (req, res) => {
  try {
    console.log('test controller');
    res.status(200).json({ message: 'Test controller works!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}