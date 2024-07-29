exports.model = {
  SellItem: require('./models/sell-item')
};

exports.router = (router) => {
  require('./routes/sell-item.route')(router);
};

exports.services = {
  SellItem: require('./service')
};
