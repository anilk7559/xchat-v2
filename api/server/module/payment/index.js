exports.model = {
  Transaction: require('./models/transaction'),
  Invoice: require('./models/invoice'),
  TokenPackage: require('./models/token-package')
};

exports.router = (router) => {
  require('./routes/transaction')(router);
  // require('./routes/paypal')(router);
  require('./routes/invoice')(router);
  require('./routes/token-package')(router);
};

exports.services = {
  Payment: require('./services/Payment'),
  TokenPackage: require('./services/TokenPackage')
};
