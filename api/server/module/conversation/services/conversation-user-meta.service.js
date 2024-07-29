const UserDto = require('../../user/dtos/user.dto');

exports.mapConversationsAndUserMetaData = async (options) => {
  /** options schema
   *  options = {
   *    userMetaDatas,
   *    conversations
   *   }
   */
  const { userMetaDatas, conversations } = options;
  if (!conversations?.length) return [];

  const items = conversations.map((conv) => {
    const newData = conv.toObject();

    const members = (newData.members || []).map((member) => {
      const dto = new UserDto(member);
      return dto.toShortInfo();
    });
    newData.members = members;

    const metaData = userMetaDatas.find((data) => data.conversationId.toString() === newData._id.toString());
    newData.userMetaData = metaData || {};
    newData.unreadMessageCount = metaData?.unreadMessageCount || 0;
    return newData;
  });

  return items;
};
