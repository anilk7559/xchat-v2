const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const Image = require('../components/image');

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
      return next(PopulateResponse.error({ message: 'Missing photo file!' }, 'ERR_MISSING_PHOTO'));
    }

    const file = req.file || req.base64Photo;
    const schema = Joi.object()
    .keys({
      name: Joi.string().allow('', null).optional(),
      description: Joi.string().allow('', null).optional(),
      price: Joi.number().allow(null).optional(), // Add necessary fields for SellItem
      mediaType: Joi.string().allow(null).optional(),
    })
    .unknown();

  const validate = schema.validate(req.body);
  if (validate.error) {
    return next(PopulateResponse.validationError(validate.error));
  }

  // Create the photo
  const photo = await Service.Media.createPhoto({
    value: validate.value,
    user: req.user,
    file
  });

    const sellItem = new DB.SellItem({
      ownerId: req.user._id,
      mediaId: photo._id,
      price: validate.value.price,
      mediaType: validate.value.mediaType,
      name: validate.value.name,
      description: validate.value.description,
      isApproved: false, // Set default approval status
      createdAt: new Date()
    });

    await sellItem.save();

    res.locals.photo = photo;
    res.locals.sellItem = sellItem;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.editPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(PopulateResponse.error({ message: 'Missing photo file!' }, 'ERR_MISSING_PHOTO'));
    }
    const file = req.file;
    const schema = Joi.object()
      .keys({
        name: Joi.string().allow('', null).optional(),
        description: Joi.string().allow('', null).optional(),
        ownerId: Joi.string().allow('', null).optional()
      })
      .unknown();

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    let user = null;
    user = req.user;
    if (req.user.role === 'admin') {
      if (!validate.value.ownerId) {
        return next(PopulateResponse.error({ message: 'Owner not found' }, 'ERR_MISSING_USER_ID'));
      }
      user = await DB.User.findOne({ _id: validate.value.ownerId });
      if (!user) {
        return next(PopulateResponse.notFound());
      }
    }

    // TODO - should define function more clearly
    const photo = await Service.Media.createPhoto({
      value: validate.value,
      user,
      file
    });
    photo.createdAt = req.media.createdAt;
    await photo.save();
    await req.media.remove();
    if (req.media.filePath && fs.existsSync(path.resolve(req.media.filePath))) {
      fs.unlinkSync(path.resolve(req.media.filePath));
    }
    if (req.media.thumbPath && fs.existsSync(path.resolve(req.media.thumbPath))) {
      fs.unlinkSync(path.resolve(req.media.thumbPath));
    }
    if (req.media.mediumPath && fs.existsSync(path.resolve(req.media.mediumPath))) {
      fs.unlinkSync(path.resolve(req.media.mediumPath));
    }
    if (req.media.blurPath && fs.existsSync(path.resolve(req.media.blurPath))) {
      fs.unlinkSync(path.resolve(req.media.blurPath));
    }
    res.locals.newPhoto = photo;
    return next();
  } catch (err) {
    return next(err);
  }
};
