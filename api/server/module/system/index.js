exports.model = {
  Config: require('./models/config'),
  Menu: require('./models/menu')
};

exports.router = (router) => {
  require('./routes/config.route')(router);
  require('./routes/menu.route')(router);
};
