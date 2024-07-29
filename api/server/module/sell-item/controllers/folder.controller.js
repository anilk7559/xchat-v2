// folderController.js
const Folder = require('../models/folder');
// const SellItem = require('../models/sell-item');


exports.createFolder = async (req, res, next) => {
  try {
    const { name } = req.body;
    const folder = new Folder({
      userId: req.user._id,
      name,
    });
    await folder.save();
    res.json({ folder });
  } catch (error) {
    next(error);
  }
};

exports.getFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find({ userId: req.user._id });
    res.json({ folders });
  } catch (error) {
    next(error);
  }
};



exports.getFoldersWithImages = async (req, res, next) => {
  try {
    const folders = await Folder.find({ userId: req.user._id });

    let totalPhotoCount = 0;
    let totalVideoCount = 0;
    let photos = [];
    let videos = [];

    const foldersWithImages = await Promise.all(
      folders.map(async (folder) => {
        const sellItems = await DB.SellItem.find({ folderId: folder._id, isApproved: true }).exec();

        const photoItems = sellItems.filter(item => item.mediaType === 'photo');
        const videoItems = sellItems.filter(item => item.mediaType === 'video');

        photos = [...photos, ...photoItems];
        videos = [...videos, ...videoItems];

        totalPhotoCount += photoItems.length
        totalVideoCount += videoItems.length;;

        return {
          ...folder.toObject(),
          sellItems,
        };
      })
    );

    res.json({
      photos: photos,
      videos: videos,
      totalPhotoCount,
      totalVideoCount
    });
  } catch (error) {
    next(error);
  }
};


