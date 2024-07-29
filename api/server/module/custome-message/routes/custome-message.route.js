const customMessageController = require('../controllers/custome-message.controller');
module.exports = (router) => {
  router.post(
    '/v1/custome-message',
    Middleware.hasRole('admin'),
    customMessageController.create,
    Middleware.Response.success('contact')
  );

  router.put(
    '/v1/custome-message/:id',
    Middleware.hasRole('admin'),
    customMessageController.findOne,
    customMessageController.update,
    Middleware.Response.success('update')
  );

  router.delete(
    '/v1/custome-message/:id',
    Middleware.hasRole('admin'),
    customMessageController.findOne,
    customMessageController.remove,
    Middleware.Response.success('remove')
  );

  router.get(
    '/v1/custome-message',
    Middleware.hasRole('admin'),
    customMessageController.list,
    Middleware.Response.success('bannerList')
  );

  router.get(
    '/v1/custome-message/:id',
    customMessageController.findOne,
    Middleware.Response.success('banner')
  );
};
