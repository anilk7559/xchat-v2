exports.model = {
  Conversation: require('./models/conversation'),
  ConversationUserMeta: require('./models/conversation-user-meta')
};

exports.router = (router) => {
  require('./routes/conversation.route')(router);
};

exports.services = {
  Conversation: require('./services/conversation.service'),
  ConversationUserMeta: require('./services/conversation-user-meta.service')
};
