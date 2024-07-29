exports.model = {
  PurchaseItem: require('./models/purchase-item')
};

exports.services = {
  Purchase: require('./services/Purchase')
};

exports.router = (router) => {
  require('./routes/purchase.route')(router);
};
