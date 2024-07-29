const abuseReportController = require('../controllers/abuse-report.controller');

module.exports = (router) => {
  /**
   * @apiDefine AbuseReportRequest
   * @apiParam {String}   title
   * @apiParam {String}   [description]
   * @apiParam {String}   [status]
   */

  /**
   * @apiGroup AbuseReport
   * @apiVersion 1.0.0
   * @api {get} /v1/abuse-reports?:name&:alias  Get list categories
   * @apiDescription Get list categories
   * @apiParam {String}   [name]      abuse-reports name
   * @apiParam {String}   [alias]     abuse-reports alias
   * @apiPermission all
   */
  router.get(
    '/v1/abuse-reports/my-reports',
    Middleware.isAuthenticated,
    abuseReportController.myList,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup AbuseReport
   * @apiVersion 1.0.0
   * @api {get} /v1/abuse-reports?:name&:alias  Get list categories
   * @apiDescription Get list categories
   * @apiParam {String}   [name]      abuse-reports name
   * @apiParam {String}   [alias]     abuse-reports alias
   * @apiPermission all
   */
  router.get(
    '/v1/abuse-reports/my-reports',
    Middleware.hasRole('admin'),
    abuseReportController.list,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup AbuseReport
   * @apiVersion 1.0.0
   * @api {post} /v1/abuse-reports  Create new abuse-reports
   * @apiDescription Create new abuse-reports
   * @apiUse authRequest
   * @apiUse AbuseReportRequest
   * @apiPermission superadmin
   */
  router.post(
    '/v1/abuse-reports',
    Middleware.isAuthenticated,
    abuseReportController.create,
    Middleware.Response.success('abuseReport')
  );

  /**
   * @apiGroup AbuseReport
   * @apiVersion 1.0.0
   * @api {put} /v1/abuse-reports/:id  Update a abuse-reports
   * @apiDescription Update a abuse-reports
   * @apiUse authRequest
   * @apiParam {String}   id        Category id
   * @apiUse AbuseReportRequest
   * @apiPermission superadmin
   */
  router.put(
    '/v1/abuse-reports/:id/status',
    Middleware.hasRole('admin'),
    abuseReportController.findOne,
    abuseReportController.updateStatus,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup AbuseReport
   * @apiVersion 1.0.0
   * @api {delete} /v1/abuse-reports/:id Remove a abuse-reports
   * @apiDescription Remove a abuse-reports
   * @apiUse authRequest
   * @apiParam {String}   id        Category id
   * @apiPermission superadmin
   */
  router.delete(
    '/v1/abuse-reports/:id',
    Middleware.hasRole('admin'),
    abuseReportController.findOne,
    abuseReportController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup AbuseReport
   * @apiVersion 1.0.0
   * @api {get} /v1/abuse-reports/:id Get abuse-reports details
   * @apiDescription Get abuse-reports details
   * @apiParam {String}   id        Category id
   * @apiPermission all
   */
  router.get(
    '/v1/abuse-reports/:id',
    Middleware.isAuthenticated,
    abuseReportController.findOne,
    Middleware.Response.success('abuseReport')
  );
};
