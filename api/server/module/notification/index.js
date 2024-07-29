exports.model = {
  Device: require('./models/device'),
  Notification: require('./models/notification')
};

exports.services = {
  Sms: require('./services/Sms'),
  Notification: require('./services/Notification')
};

exports.router = (router) => {
  require('./routes/device.route')(router);
  require('./routes/notification.route')(router);
};
