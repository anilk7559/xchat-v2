const notificationController = require('../controllers/notification.controller');

module.exports = (router) => {
  router.get(
    '/v1/notifications',
    Middleware.isAuthenticated,
    notificationController.list,
    Middleware.Response.success('list')
  );

  router.get(
    '/v1/notifications/unread/list',
    Middleware.isAuthenticated,
    notificationController.listUnread,
    Middleware.Response.success('list')
  );

  router.get(
    '/v1/notifications/unread/count',
    Middleware.isAuthenticated,
    notificationController.countUnread,
    Middleware.Response.success('count')
  );

  router.put(
    '/v1/notifications/read/all',
    Middleware.isAuthenticated,
    notificationController.readAll,
    Middleware.Response.success('read')
  );

  router.put(
    '/v1/notifications/read/:id',
    Middleware.isAuthenticated,
    notificationController.read,
    Middleware.Response.success('read')
  );
};
