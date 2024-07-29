// exports.model = {
//   Contact: require('./models/contact-us.model')
// };

exports.router = (router) => {
  require('./routes/contact-us.route')(router);
};
