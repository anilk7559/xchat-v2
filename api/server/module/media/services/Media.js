const Image = require('../components/image');
const Q = require('../queue');

const SYSTEM_CONST = require('../../system/constants');
const { signToken } = require('../../auth/auth.service');

exports.createPhoto = async (options) => {
  const photoThumbSize = await DB.Config.findOne({ key: SYSTEM_CONST.PHOTO_THUMB_SIZE });
  if (!photoThumbSize || !photoThumbSize.value) {
    return PopulateResponse.serverError({ msg: 'Missing photo thumb size!' });
  }

  const photoResizeBackgroundColor = await DB.Config.findOne({
    key: SYSTEM_CONST.PHOTO_RESIZE_BACKGROUND_COLOR
  });
  const background = photoResizeBackgroundColor ? photoResizeBackgroundColor.value : 'transparent';

  const size = photoThumbSize.value.split('x');
  const width = size[0] || 200;
  const height = size.length > 1 ? size[1] : 200;

  const file = options.file;
  const value = options.value;
  const user = options.user;
  const thumbPath = await Image.resize({
    input: file.path,
    width,
    height,
    background
  });
  const blurPath = await Image.blur({
    input: file.path
  });
  const photo = new DB.Media({
    type: options.type || 'photo',
    systemType: value.systemType,
    name: value.name || file.filename,
    mimeType: file.mimetype,
    description: value.description,
    uploaderId: user._id,
    ownerId: user.role === 'admin' && value.ownerId ? value.ownerId : user._id,
    originalPath: file.path,
    filePath: file.path,
    thumbPath,
    blurPath,
    convertStatus: 'done',
    uploaded: true,
    size: file.size
  });
  await photo.save();

  return photo;
};

exports.createVideo = async (options) => {
  const file = options.file;
  const value = options.value;
  const user = options.user;
  const video = new DB.Media({
    type: 'video',
    systemType: value.systemType,
    name: value.name || file.filename,
    mimeType: file.mimetype,
    description: value.description,
    uploaderId: user._id,
    ownerId: user.role === 'admin' && value.ownerId ? value.ownerId : user._id,
    filePath: file.path,
    originalPath: file.path,
    convertStatus: 'processing',
    uploaded: true,
    size: file.size
  });
  await video.save();

  // TODO - define me here
  await Q.convertVideo(video);

  return video;
};

exports.createFile = async (options) => {
  const file = options.file;
  const value = options.value;
  const user = options.user;

  const media = new DB.Media({
    type: 'file',
    systemType: value.systemType,
    name: value.name || file.filename,
    mimeType: file.mimetype,
    description: value.description,
    uploaderId: user._id,
    ownerId: user.role === 'admin' && value.ownerId ? value.ownerId : user._id,
    originalPath: file.path,
    filePath: file.path,
    convertStatus: 'done',
    uploaded: true,
    size: file.size
  });
  await media.save();

  return media;
};

exports.populateAuthRequest = async (options) => {
  if (!options.user || !options.user._id) {
    return null;
  }
  const data = options.media.toObject();
  if (data.fileUrl) {
    // create auth jwt in 4h
    const expireTokenDuration = 60 * 60 * 4; // 4h
    const token = signToken(options.user._id, options.user.role, expireTokenDuration);
    data.fileUrl += `?access_token=${token}&userId=${options.user._id}&mediaId=${data._id}`;
  }

  delete data.filePath;
  delete data.mediumPath;
  delete data.thumbPath;
  delete data.blurPath;
  delete data.originalPath;
  return data;
};
