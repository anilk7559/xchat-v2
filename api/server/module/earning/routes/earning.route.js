const earningController = require('../controllers/earning.controller');

module.exports = (router) => {
  router.get(
    '/v1/earning',
    Middleware.isAuthenticated,
    earningController.list,
    Middleware.Response.success('list')
  );
  router.get(
    '/v1/earning/admin-search',
    Middleware.isAuthenticated,
    earningController.adminSearch,
    Middleware.Response.success('list')
  );
};
