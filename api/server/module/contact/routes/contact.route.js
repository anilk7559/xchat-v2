const contactController = require('../controllers/contact.controller');

module.exports = (router) => {
  router.post(
    '/v1/contact',
    Middleware.isAuthenticated,
    contactController.create,
    Middleware.Response.success('contact')
  );

  router.get(
    '/v1/contact',
    Middleware.isAuthenticated,
    contactController.list,
    Middleware.Response.success('list')
  );

  router.post(
    '/v1/contact/sync',
    Middleware.isAuthenticated,
    contactController.sync,
    Middleware.Response.success('sync')
  );

  router.get(
    '/v1/contact/:id',
    Middleware.isAuthenticated,
    contactController.find,
    Middleware.Response.success('find')
  );

  router.delete(
    '/v1/contact/:userId',
    Middleware.isAuthenticated,
    contactController.delete,
    Middleware.Response.success('remove')
  );
};
