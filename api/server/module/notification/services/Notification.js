const _ = require('lodash');

exports.getUnreadListByUser = async (userId, offset = 0, limit = 30) => DB.Notification.find({
  userId,
  read: false
})
  .populate('user')
  .populate('createdBy')
  .sort({ createdAt: -1 })
  .skip(offset)
  .limit(limit)
  .exec();

exports.getListByUser = async (userId, offset = 0, limit = 30) => {
  const query = { userId };
  const items = await DB.Notification.find(query)
    .populate('user')
    .populate('createdBy')
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .exec();
  const count = await DB.Notification.countDocuments(query);

  return {
    items,
    count
  };
};

exports.readAll = async (userId) => DB.Notification.updateMany({ userId }, {
  $set: {
    read: true
  }
});

exports.countUnread = async (userId) => DB.Notification.countDocuments({
  userId,
  read: false
})
  .exec();

exports.read = async (userId, notificationId) => DB.Notification.updateOne({ _id: notificationId, userId }, { $set: { read: true } });

exports.create = async (userId, data) => {
  const notification = await DB.Notification.create({
    userId,
    ...data
  });

  await Service.Socket.emitToUsers(userId, 'notification', notification);
};

/**
 * notification when user sends tip to model
 * @param {ShareLove} tip
 */
exports.tipToModel = async (tip) => {
  // TODO - add queue?

  const user = await DB.User.findOne({ _id: tip.userId });
  if (!user) return;

  const notification = await DB.Notification.create({
    userId: tip.modelId,
    refId: tip.userId,
    value: tip.token,
    byId: tip.userId,
    type: 'tip',
    text: `${user.username} tipped ${tip.token} token(s)`,
    userAvartarUrl: user.avatarUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  await Service.Socket.emitToUsers(notification.userId, 'notification', notification);
};

exports.purchaseMediaItem = async (purchaseItem, { user, item }) => {
  const notification = await DB.Notification.create({
    userId: purchaseItem.modelId,
    refId: purchaseItem._id,
    byId: user._id,
    value: _.pick(item, ['_id', 'name', 'mediaId', 'price', 'mediaType']),
    type: 'purchase_media',
    text: `${user.username} has purchased ${item.name}`,
    userAvartarUrl: user.avatarUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  await Service.Socket.emitToUsers(notification.userId, 'notification', notification);
};
