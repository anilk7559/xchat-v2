exports.model = {
  Message: require('./models/message'),
  BookmarkMessage: require('./models/message-bookmarked')
};

exports.router = (router) => {
  require('./routes/message.route')(router);
};

exports.services = {
  Message: require('./services/Message')
};
