const adminStatsController = require('../controllers/admin-stats.controller');

module.exports = (router) => {
  router.get(
    '/v1/admin/dashboard-stats',
    Middleware.isAuthenticated,
    adminStatsController.adminDashboardStats,
    Middleware.Response.success('stats')
  );

  router.get(
    '/v1/admin/stats/total-pending-models',
    Middleware.isAuthenticated,
    adminStatsController.totalPendingModels,
    Middleware.Response.success('stats')
  );
};
