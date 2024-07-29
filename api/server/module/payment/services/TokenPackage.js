const { Expo } = require('expo-server-sdk');
const Queue = require('../../../kernel/services/queue');

const buyTokenQ = Queue.create('buy_token');

buyTokenQ.process(async (job, done) => {
  try {
    const pnData = job.data.tokenPackage;
    if (pnData && pnData.packageId && pnData.userId) {
      const tokenPackage = await DB.TokenPackage.findOne({ _id: pnData.packageId });
      await Promise.all([Service.Socket.emitToUsers(pnData.userId, 'buy_token', pnData)]);
      const pushTokens = await DB.Device.find({ userId: pnData.userId });
      if (pushTokens && pushTokens.length) {
        const expo = new Expo();
        const pushTokenIds = pushTokens.map((pushToken) => pushToken.identifier);
        const notify = [
          {
            to: pushTokenIds,
            sound: 'default',
            title: 'Buy token successfully!',
            body: `You have purchased ${tokenPackage.token} tokens`,
            data: pnData
          }
        ];
        await expo.sendPushNotificationsAsync(notify);
      }
    }
  } catch (e) {
    console.log(e);
  }

  return done();
});

exports.notifyAndUpdateRelationData = async (object) => {
  const data = object.toObject ? object.toObject() : object;
  return buyTokenQ.createJob({ tokenPackage: data }).save();
};

exports.updateToken = async (options) => {
  const user = await DB.User.findOne({ _id: options.userId });
  if (!user) {
    throw new Error('Fan not found!');
  }

  const tokenPackage = await DB.TokenPackage.findOne({ _id: options.packageId });
  if (!tokenPackage) {
    throw new Error('Token package not found');
  }

  await Service.User.increaseBalance(user._id, tokenPackage.token);
  // TODO - mailing here
  // await Service.Mailer.send('shop/featured-shop-pay-success.html', shop.email, {
  //   subject: 'Payment for featured shop is success',
  //   shop: shop.toObject(),
  //   featuredTo: expTime.format('DD/MM/YYYY')
  // });
  return true;
};
