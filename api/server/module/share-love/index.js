exports.model = {
  ShareLove: require('./models/share-love')
};

exports.services = {
  ShareLoveService: require('./services/ShareLove')
};

exports.router = (router) => {
  require('./routes/share-love.route')(router);
};
