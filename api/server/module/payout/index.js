exports.model = {
  PayoutRequest: require('./models/payout-request.model'),
  PayoutAccount: require('./models/payout-account.model')
};

exports.router = (router) => {
  require('./routes/payout-request.route')(router);
  require('./routes/payout-account.route')(router);
};

exports.services = {
  PayoutRequest: require('./services/payout-request.service')
};
