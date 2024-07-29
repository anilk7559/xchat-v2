const contactUsController = require('../controllers/contact-us.controller');

module.exports = (router) => {
  router.post(
    '/v1/contact-us',
    contactUsController.create,
    Middleware.Response.success('contact')
  );
};
