exports.model = {
  AbuseReport: require('./models/abuse-report')
};

exports.router = (router) => {
  require('./routes/abuse-report.route')(router);
};
