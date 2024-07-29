const fs = require('fs');
const path = require('path');

exports.checkAndRemoveRelatedData = async (sellItem) => {
  const count = await DB.PurchaseItem.count({ sellItemId: sellItem._id, mediaId: sellItem.mediaId });
  if (!count) {
    // Remove media when nobody has bought it yet
    const media = await DB.Media.findOne({ _id: sellItem.mediaId });
    await media.remove();
    if (media.originalPath && fs.existsSync(path.resolve(media.originalPath))) {
      fs.unlinkSync(path.resolve(media.originalPath));
    }
    if (media.filePath && fs.existsSync(path.resolve(media.filePath))) {
      fs.unlinkSync(path.resolve(media.filePath));
    }
    if (media.thumbPath && fs.existsSync(path.resolve(media.thumbPath))) {
      fs.unlinkSync(path.resolve(media.thumbPath));
    }
    if (media.blurPath && fs.existsSync(path.resolve(media.blurPath))) {
      fs.unlinkSync(path.resolve(media.blurPath));
    }
    if (media.mediumPath && fs.existsSync(path.resolve(media.mediumPath))) {
      fs.unlinkSync(path.resolve(media.mediumPath));
    }
  }
};

exports.totalVideos = async (userId = null) => {
  const query = {
    mediaType: 'video',
    deleted: {
      $ne: true
    }
  };
  if (userId) {
    query.userId = userId;
  }

  return DB.SellItem.countDocuments(query);
};

exports.totalPhotos = async (userId = null) => {
  const query = {
    mediaType: 'photo',
    deleted: {
      $ne: true
    }
  };
  if (userId) {
    query.userId = userId;
  }

  return DB.SellItem.countDocuments(query);
};

exports.totalVideoSales = async (modelId = null) => {
  const query = {
    mediaType: 'video'
  };
  if (modelId) {
    query.modelId = modelId;
  }
  const data = await DB.PurchaseItem.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$price'
        },
        count: {
          $sum: 1
        }
      }
    }
  ]);
  if (!data || !data.length) {
    return {
      totalPrice: 0,
      count: 0
    };
  }

  return {
    totalPrice: data[0].total,
    count: data[0].count
  };
};

exports.totalPhotoSales = async (modelId = null) => {
  const query = {
    mediaType: 'photo'
  };
  if (modelId) {
    query.modelId = modelId;
  }

  const data = await DB.PurchaseItem.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$price'
        },
        count: {
          $sum: 1
        }
      }
    }
  ]);

  if (!data || !data.length) {
    return {
      totalPrice: 0,
      count: 0
    };
  }

  return {
    totalPrice: data[0].total,
    count: data[0].count
  };
};

exports.totalSales = async (modelId = null) => {
  const query = {};
  if (modelId) {
    query.modelId = modelId;
  }
  const data = await DB.PurchaseItem.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$price'
        },
        count: {
          $sum: 1
        }
      }
    }
  ]);
  if (!data) {
    return {
      totalPrice: 0,
      count: 0
    };
  }

  return {
    totalPrice: data[0].total,
    count: data[0].count
  };
};
