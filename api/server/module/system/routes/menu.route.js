const menuController = require('../controllers/menu.controller');

module.exports = (router) => {
  router.post(
    '/v1/menus',
    Middleware.hasRole('admin'),
    menuController.create,
    Middleware.Response.success('menu')
  );

  router.put(
    '/v1/menus/:id',
    Middleware.hasRole('admin'),
    menuController.findOne,
    menuController.update,
    Middleware.Response.success('update')
  );

  router.delete(
    '/v1/menus/:id',
    Middleware.hasRole('admin'),
    menuController.findOne,
    menuController.remove,
    Middleware.Response.success('remove')
  );

  router.get(
    '/v1/menus/:id',
    Middleware.hasRole('admin'),
    menuController.findOne,
    Middleware.Response.success('menu')
  );

  router.get(
    '/v1/menus',
    Middleware.hasRole('admin'),
    menuController.list,
    Middleware.Response.success('list')
  );

  router.get(
    '/v1/menus/sections/:section',
    menuController.publicMenuBySection,
    Middleware.Response.success('menus')
  );
};
