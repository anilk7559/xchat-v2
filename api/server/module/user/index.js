exports.model = {
  User: require('./models/user'),
  VerifyCode: require('./models/verify-code')
};

exports.mongoosePlugin = require('./mongoosePlugin');

exports.services = {
  User: require('./services/User')
};

exports.router = (router) => {
  require('./routes/user.route')(router);
};
