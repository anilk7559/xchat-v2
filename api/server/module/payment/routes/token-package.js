const tokenPackageController = require('../controllers/token-package.controller');

module.exports = (router) => {
  /**
   * @apiDefine tokenPackage
   * @apiParam {String}   name
   * @apiParam {String}   description
   * @apiParam {Number}   price
   * @apiParam {Number}   ordering
   */

  /**
   * @apiGroup Token_Package
   * @apiVersion 1.0.0
   * @apiName Create
   * @api {post} /v1/token-package
   * @apiUse authRequest
   * @apiUse shopFeaturedRequest
   * @apiPermission admin
   */
  router.post(
    '/v1/token-package',
    Middleware.hasRole('admin'),
    tokenPackageController.create,
    Middleware.Response.success('create')
  );

  /**
   * @apiGroup Token_Package
   * @apiVersion 1.0.0
   * @apiName Update
   * @api {put} /v1/token-package/:tokenPackageId
   * @apiUse authRequest
   * @apiParam {String}   tokenPackageId
   * @apiUse shopFeaturedRequest
   * @apiPermission admin
   */
  router.put(
    '/v1/token-package/:tokenPackageId',
    Middleware.hasRole('admin'),
    tokenPackageController.findOne,
    tokenPackageController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Token_Package
   * @apiVersion 1.0.0
   * @apiName Delete
   * @api {delete} /v1/token-package/:tokenPackageId
   * @apiDescription Remove a post
   * @apiUse shopFeaturedRequest
   * @apiParam {String}   tokenPackageId
   * @apiPermission admin
   */
  router.delete(
    '/v1/token-package/:tokenPackageId',
    Middleware.hasRole('admin'),
    tokenPackageController.findOne,
    tokenPackageController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Token_Package
   * @apiVersion 1.0.0
   * @apiName Listing
   * @api {get} /v1/token-package?:q
   * @apiDescription Get list token-package
   * @apiParam {String}   [q]      search keywords
   * @apiPermission admin
   */
  router.get(
    '/v1/token-package',
    Middleware.isAuthenticated,
    tokenPackageController.list,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup Token_Package
   * @apiVersion 1.0.0
   * @apiName FindOne
   * @api {get} /v1/token-package/:tokenPackageId
   * @apiDescription Find one a package
   * @apiUse shopFeaturedRequest
   * @apiParam {String}   tokenPackageId
   * @apiPermission admin or seller
   */
  router.get(
    '/v1/token-package/:tokenPackageId',
    Middleware.isAuthenticated,
    tokenPackageController.findOne,
    Middleware.Response.success('tokenPackage')
  );
};
