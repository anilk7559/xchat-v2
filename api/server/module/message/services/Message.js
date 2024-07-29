const fs = require('fs');
const path = require('path');

exports.checkSpam = async (options) => {
  const countMessage = await DB.Message.count({ conversationId: options.conversationId });
  if (countMessage < 3) {
    // check for new conversation
    return true;
  }
  const countUnreadMessage = await DB.ConversationUserMeta.count({
    conversationId: options.conversationId,
    userId: options.userId,
    $or: [
      {
        unreadMessageCount: { $gte: 3 }
      },
      {
        unreadMessageCount: 0,
        isReplied: false
      }
    ]
  });
  if (countUnreadMessage > 0) {
    return false;
  }

  return true;
};

exports.readMessage = async (options) => {
  await DB.ConversationUserMeta.update(
    { conversationId: options.conversationId, userId: options.userId },
    { unreadMessageCount: 0 }
  );
  return true;
};

/**
 *
 * @param {*} options = messages
 */
exports.removeRelatedData = async (options) => {
  // update conversation last message
  const conversation = await DB.Conversation.findOne({ _id: options.conversationId });
  if (!conversation) {
    return PopulateResponse.notFound();
  }

  const lastMessage = await DB.Message.findOne({ conversationId: options.conversationId }).sort({ createdAt: -1 });
  if (!lastMessage) {
    return PopulateResponse.notFound();
  }

  conversation.lastMessageId = lastMessage ? lastMessage._id : null;
  await conversation.save();

  // remove file
  if (options.type !== 'text' && options.fileIds && options.fileIds.length > 0) {
    const media = await DB.Media.find({ _id: { $in: options.fileIds }, systemType: 'message' });
    await DB.Media.deleteMany({ _id: { $in: options.fileIds }, systemType: 'message' });

    media.forEach((item) => {
      if (item.originalPath && fs.existsSync(path.resolve(item.originalPath))) {
        fs.unlinkSync(path.resolve(item.originalPath));
      }
      if (item.filePath && fs.existsSync(path.resolve(item.filePath))) {
        fs.unlinkSync(path.resolve(item.filePath));
      }
      if (item.thumbPath && fs.existsSync(path.resolve(item.thumbPath))) {
        fs.unlinkSync(path.resolve(item.thumbPath));
      }
      if (item.blurPath && fs.existsSync(path.resolve(item.blurPath))) {
        fs.unlinkSync(path.resolve(item.blurPath));
      }
      if (item.mediumPath && fs.existsSync(path.resolve(item.mediumPath))) {
        fs.unlinkSync(path.resolve(item.mediumPath));
      }
    });
  }
  return true;
};
