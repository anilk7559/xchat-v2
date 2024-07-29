const invoiceController = require('../controllers/invoice.controller');

module.exports = (router) => {
  /**
   * @apiGroup Invoice
   * @apiVersion 1.0.0
   * @api {get} /v1/invoice  Get invoices of user
   * @apiDescription  Get invoices of user
   * @apiPermission user
   */
  router.get(
    '/v1/invoice',
    Middleware.isAuthenticated,
    invoiceController.search,
    Middleware.Response.success('search')
  );

  /**
   * @apiGroup Invoice
   * @apiVersion 1.0.0
   * @api {get} /v1/invoice/:itemId  Get invoice detail of user
   * @apiDescription  Get invoice detail of user
   * @apiPermission user
   */
  router.get(
    '/v1/invoice/:itemId',
    Middleware.isAuthenticated,
    invoiceController.findOne,
    Middleware.Response.success('findOne')
  );
};
