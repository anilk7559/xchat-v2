const purchaseItemController = require('../controllers/purchase.controller');

module.exports = (router) => {
  /**
   * @apiGroup Purchase Item
   * @apiVersion 1.0.0
   * @api {post} /v1/purchase-item  Purchase item
   * @apiDescription Purchase item
   * @apiUse authRequest
   * @apiPermission user model
   */
  router.post(
    '/v1/purchase-item',
    Middleware.isAuthenticated,
    purchaseItemController.purchase,
    Middleware.Response.success('purchase')
  );

  /**
   * @apiGroup Purchase Item
   * @apiVersion 1.0.0
   * @api {get} /v1/purchase-item Get list purchase items
   * @apiDescription Get list purchase items
   * @apiPermission all
   */

  router.get(
    '/v1/purchase-item',
    Middleware.isAuthenticated,
    purchaseItemController.myPurchaseItem,
    Middleware.Response.success('myPurchaseItem')
  );

  /**
   * @apiGroup Purchase Item
   * @apiVersion 1.0.0
   * @api {get} /v1/purchase-item/:itemId/download/:mediaId Download a photo
   * @apiDescription Download a purchase item
   * @apiUse authRequest
   * @apiParam {String}  itemId
   * @apiPermission user
   */
  router.get(
    '/v1/purchase-item/:itemId/download',
    Middleware.isAuthenticated,
    purchaseItemController.findOne,
    purchaseItemController.download,
    Middleware.Response.success('download')
  );

  /**
   * @apiGroup Purchase Item
   * @apiVersion 1.0.0
   * @api {get} /v1/purchase-item/:itemId/download/:mediaId Download a photo
   * @apiDescription Download a purchase item
   * @apiUse authRequest
   * @apiParam {String}  itemId
   * @apiPermission user
   */
  router.delete(
    '/v1/purchase-item/:itemId',
    Middleware.isAuthenticated,
    purchaseItemController.findOne,
    purchaseItemController.delete,
    Middleware.Response.success('delete')
  );
};
