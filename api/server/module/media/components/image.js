const sharp = require('sharp');

const path = require('path');
const fs = require('fs');
const base64Img = require('base64-img');
const config = require('../config');

const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return {
    r,
    g,
    b,
    alpha
  };
};

exports.resize = async (options) => {
  const width = Number(options.width);
  const height = Number(options.height);
  const inputFile = fs.existsSync(options.input) ? options.input : path.resolve(options.input);
  const fileName = options.outputName || `${Helper.String.getFileName(options.input, true)}_${width}x${height}.png`;
  const outputFile = path.join(path.dirname(inputFile), fileName);
  const background = options.background || 'transparent';
  // https://sharp.pixelplumbing.com/api-resize
  const resizeOption = options.resizeOption || {
    // how the image should be resized to fit both provided dimensions, one of cover, contain, fill, inside or outside. (optional, default 'cover')
    fit: 'cover',
    // position, gravity or strategy to use when fit is cover or contain
    position: 'centre',
    // background colour when fit is contain, parsed by the color  module, defaults to black without transparency. (optional, default {r:0,g:0,b:0,alpha:1})
    background: background === 'transparent' ? {
      r: 0, g: 0, b: 0, alpha: 1
    } : hex2rgba(background)
  };

  await sharp(inputFile)
    .resize(width, height, resizeOption)
    .rotate()
    .toFile(outputFile);

  fs.renameSync(outputFile, outputFile.replace('/protected/', '/'));
  return outputFile.replace('/protected/', '/');
};

// TODO - define folder
exports.saveBase64Image = async (base64String, options = {}) => {
  const originalname = options.name || `${Helper.String.randomString(5)}.png`;
  const nameWithoutExt = Helper.String.createAlias(Helper.String.getFileName(originalname, true));
  const ext = base64String.indexOf('image/jpeg') > -1 ? 'jpg' : 'png';
  let fileName = `${nameWithoutExt}.${ext}`;
  if (fs.existsSync(path.resolve(config.photoDir, fileName))) {
    fileName = `${nameWithoutExt}-${Helper.String.randomString(5)}`;
  } else {
    fileName = `${nameWithoutExt}`;
  }

  return new Promise((resolve, reject) => {
    base64Img.img(base64String, path.resolve(config.protectPhotoDir), fileName, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        path: `${config.protectPhotoDir}${fileName}.${ext}`,
        mimetype: ext === 'jpg' ? 'image/jpeg' : 'image/png',
        filename: originalname
      });
    });
  });
};

/**
 * create small image (10x10 pixels) for this image
 * in FE we can scale it
 * @param {*} options
 * @returns
 */
exports.blur = async (options) => {
  const width = options.width || 100;
  const height = options.height || 100;
  const inputFile = fs.existsSync(options.input) ? options.input : path.resolve(options.input);
  const fileName = options.outputName
    || `${Helper.String.randomString(20)}${Helper.String.getFileName(options.input, true)}.png`;
  const outputFile = path.join(config.photoDir, fileName);
  const background = options.background || 'transparent';
  const resizeOption = options.resizeOption || {
    // how the image should be resized to fit both provided dimensions, one of cover, contain, fill, inside or outside. (optional, default 'cover')
    fit: 'cover',
    // position, gravity or strategy to use when fit is cover or contain
    position: 'centre',
    // background colour when fit is contain, parsed by the color  module, defaults to black without transparency. (optional, default {r:0,g:0,b:0,alpha:1})
    background: background === 'transparent' ? {
      r: 0, g: 0, b: 0, alpha: 1
    } : hex2rgba(background)
  };

  await sharp(inputFile)
    .resize(width, height, resizeOption)
    .rotate()
    .toFile(outputFile);
  return outputFile;
};
