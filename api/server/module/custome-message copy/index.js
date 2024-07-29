exports.model = {
  CustomeMessage: require('./models/custome-message.model')
};
// ./models/custome-message.model
exports.router = (router) => {
  require('./routes/custome-message.route')(router);
};
