exports.model = {
  Contact: require('./models/contact.model')
};

exports.router = (router) => {
  require('./routes/contact.route')(router);
};
