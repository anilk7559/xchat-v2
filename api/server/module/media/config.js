const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const photoDir = 'public/photos/';
const protectPhotoDir = 'public/protected/photos/';
const videoDir = 'public/videos/';
const protectVideoDir = 'public/protected/videos/';
const fileDir = 'public/files/';
const protectFileDir = 'public/protected/files/';
const fullPhotoPath = path.resolve(photoDir);
const fullProtectPhotoPath = path.resolve(protectPhotoDir);
const fullVideoPath = path.resolve(videoDir);
const fullProtectVideoPath = path.resolve(protectVideoDir);
const fullFilePath = path.resolve(fileDir);
const fullProtectFilePath = path.resolve(protectFileDir);

const certificateProtected = path.resolve('public/protected/certification');
const certificatePublic = path.resolve('public/certification');
if (!fs.existsSync(certificateProtected)) {
  mkdirp.sync(certificateProtected);
}
if (!fs.existsSync(certificatePublic)) {
  mkdirp.sync(certificatePublic);
}
if (!fs.existsSync(path.resolve('public/avatar'))) {
  mkdirp.sync(path.resolve('public/avatar'));
}

if (!fs.existsSync(fullPhotoPath)) {
  mkdirp.sync(fullPhotoPath);
}

if (!fs.existsSync(fullProtectPhotoPath)) {
  mkdirp.sync(fullProtectPhotoPath);
}

if (!fs.existsSync(fullVideoPath)) {
  mkdirp.sync(fullVideoPath);
}

if (!fs.existsSync(fullProtectVideoPath)) {
  mkdirp.sync(fullProtectVideoPath);
}

if (!fs.existsSync(fullFilePath)) {
  mkdirp.sync(fullFilePath);
}

if (!fs.existsSync(fullProtectFilePath)) {
  mkdirp.sync(fullProtectFilePath);
}

module.exports = {
  photoDir,
  protectPhotoDir,
  videoDir,
  protectVideoDir,
  fileDir,
  protectFileDir
};
