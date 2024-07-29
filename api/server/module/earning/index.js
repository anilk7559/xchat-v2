exports.model = {
  Earning: require('./models/earning.model')
};

exports.services = {
  Earning: require('./services/earning.service')
};

exports.router = (router) => {
  require('./routes/earning.route')(router);
};
