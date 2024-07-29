const Queue = require('../../kernel/services/queue');
// const { Expo } = require('expo-server-sdk');

const messageQ = Queue.create('message');

messageQ.process(async (job, done) => {
  try {
    const message = job.data.message;
    const socketId = job.data.socketId;

    const conversation = await DB.Conversation.findOne({ _id: message.conversationId });
    if (!conversation) {
      return done();
    }
    // update user meta data for sender
    await DB.ConversationUserMeta.update(
      { conversationId: conversation._id, userId: message.senderId },
      {
        isReplied: true,
        unreadMessageCount: 0
      }
    );
    const sender = await DB.User.findOne({ _id: message.senderId });
    message.sender = sender.getPublicProfile();

    message.uuid = Helper.String.generateUuid();
    // emit socket event to client side - recipient
    await Service.Socket.emitToUsers(message.recipientId, 'new_message', message);
    if (socketId) {
      await Service.Socket.emitToUsers(message.senderId, 'new_message', Object.assign(message, socketId));
    }
    // update unread message metadata for recipient
    await DB.ConversationUserMeta.update(
      { conversationId: conversation._id, userId: message.recipientId },
      {
        $inc: { unreadMessageCount: 1 },
        isReplied: false
      },
      { upsert: true }
    );

    // expo push notification, it use to mobile platform
    // const pushTokens = await DB.Device.find({ userId: message.recipientId });
    // if (pushTokens && pushTokens.length > 0) {
    //   const expo = new Expo();
    //   const pushTokenIds = pushTokens.map(pushToken => pushToken.identifier);
    //   const messages = [
    //     {
    //       to: pushTokenIds,
    //       sound: 'default',
    //       title: pnData.sender.username,
    //       body: pnData.type === 'text' ? pnData.text : '[New Image]',
    //       data: { messageId: pnData._id }
    //     }
    //   ];
    //   await expo
    //     .sendPushNotificationsAsync(messages)
    //     .then()
    //     .catch(error => console.log(error));
    // }

    // update last message to conversation
    conversation.lastMessageId = message._id;
    await conversation.save();
  } catch (e) {
    console.log(`Update relate data of message error: ${e}`);
  }

  return done();
});

exports.notifyAndUpdateRelationData = (message, socketId) => {
  const data = message.toObject ? message.toObject() : message;

  messageQ.createJob({ message: data, socketId }).save();
};
