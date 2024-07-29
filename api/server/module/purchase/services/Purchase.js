exports.createPurchaseItem = async (options) => {
  const user = await DB.User.findOne({ _id: options.user._id });
  if (!user) throw new Error('User not found!');

  const count = await DB.PurchaseItem.count({
    userId: options.user._id,
    sellItemId: options.sellItemId,
    deleted: {
      $ne: true
    }
  });
  if (count) {
    throw new Error('You have purchased this item already!');
  }
  const sellItem = await DB.SellItem.findOne({ _id: options.sellItemId });

  if (!sellItem) {
    throw new Error('Sell item not found');
  }

  if (options.user.balance < sellItem.price) {
    throw new Error("You don't have enough tokens to purchase a content");
  }

  const purchaseItem = new DB.PurchaseItem({
    sellItemId: options.sellItemId,
    name: sellItem.name,
    mediaId: sellItem.mediaId,
    mediaType: sellItem.mediaType,
    price: sellItem.price,
    userId: options.user._id,
    modelId: sellItem.userId
  });

  await purchaseItem.save();

  // Update Earning Data
  const EarningData = {
    userId: options.user._id,
    modelId: purchaseItem.modelId,
    type: 'purchase_media',
    token: purchaseItem.price,
    itemId: purchaseItem._id,
    status: 'approved'
  };
  await Service.Earning.create(EarningData);

  await Service.Socket.emitToUsers(purchaseItem.modelId.toString(), 'purchased_item', {
    userId: options.user._id,
    modelId: purchaseItem.modelId,
    type: 'purchased_item',
    token: purchaseItem.price,
    itemId: purchaseItem._id,
    item: sellItem.toObject(),
    status: 'approved',
    username: user.username,
    createdAt: new Date()
  });

  // create notification
  await Service.Notification.purchaseMediaItem(purchaseItem, {
    item: sellItem.toObject(),
    user: user.toObject()
  });

  return purchaseItem;
};

exports.delete = async (itemId, softDelete = true) => {
  if (softDelete) {
    await DB.PurchaseItem.updateOne(
      { _id: itemId },
      {
        $set: {
          deleted: true
        }
      }
    );
  } else {
    await DB.PurchaseItem.remove({ _id: itemId });
  }

  return true;
};
