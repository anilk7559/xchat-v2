const shareLoveController = require('../controllers/share-love.controller');

module.exports = (router) => {
  /**
   * @apiGroup Share Love
   * @apiVersion 1.0.0
   * @api {post} /v1/share-love/create  Share Love
   * @apiDescription Create Share Love
   * @apiUse authRequest
   * @apiPermission user model
   */
  router.post(
    '/v1/share-love/create',
    Middleware.isAuthenticated,
    shareLoveController.create,
    Middleware.Response.success('shareLove')
  );

  /**
   * @apiGroup Share Love
   * @apiVersion 1.0.0
   * @api {get} /v1/share-love/count  Share Love
   * @apiDescription Count Share Love
   * @apiUse authRequest
   * @apiPermission admin
   */
  router.get(
    '/v1/share-love/count',
    Middleware.hasRole('admin'),
    shareLoveController.count,
    Middleware.Response.success('count')
  );
};
