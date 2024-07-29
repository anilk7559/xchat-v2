exports.removeDeleted = async (conversationId, userId) => {
  const conversation = conversationId instanceof DB.Conversation ? conversationId : await DB.Conversation.findOne({ _id: conversationId });
  if (conversation) {
    const deleted = (conversation.deletedByIds || []).find((id) => id.toString() === userId.toString());
    if (deleted) {
      await DB.Conversation.updateOne({ _id: conversation._id }, {
        $pull: {
          deletedByIds: userId
        }
      });
    }
  }
};
