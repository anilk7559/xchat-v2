const transactionController = require('../controllers/transaction.controller');

module.exports = (router) => {
  /**
   * @apiDefine transactionRequest
   * @apiParam {String}   service `order` or `shop_featured`
   * @apiParam {String}   itemId
   * @apiParam {String}   [redirectSuccessUrl]
   * @apiParam {String}   [redirectCancelUrl]
   */

  /**
   * @apiGroup Payment
   * @apiVersion 1.0.0
   * @apiName Create transaction
   * @api {post} /v1/payment/transactions/request  Create transacation
   * @apiDescription create transaction and get redirect url
   * @apiUse transactionRequest
   * @apiPermission user
   */
  router.post(
    '/v1/payment/transactions/request',
    Middleware.loadUser,
    transactionController.request,
    Middleware.Response.success('request')
  );

  router.post(
    '/v1/ccbill/webhook',
    Middleware.Request.log,
    transactionController.doCCBillCallhook,
    Middleware.Response.success('callhook')
  );

  router.post(
    '/v1/ccbill/callhook',
    Middleware.Request.log,
    transactionController.doCCBillCallhook,
    Middleware.Response.success('callhook')
  );
};
