const payoutRequest = require('../controllers/payout-request.controller');

module.exports = (route) => {
  route.post(
    '/v1/payout-request',
    Middleware.isAuthenticated,
    payoutRequest.request,
    Middleware.Response.success('request')
  );

  route.get('/v1/payout-request', Middleware.isAuthenticated, payoutRequest.list, Middleware.Response.success('list'));

  route.put('/v1/payout-request/:id', Middleware.isAuthenticated, payoutRequest.update, Middleware.Response.success('update'));

  route.post(
    '/v1/payout-request/approve/:id',
    Middleware.isAuthenticated,
    payoutRequest.approve,
    Middleware.Response.success('approve')
  );

  route.post(
    '/v1/payout-request/reject/:id',
    Middleware.isAuthenticated,
    payoutRequest.reject,
    Middleware.Response.success('reject')
  );

  route.post(
    '/v1/payout-request/paid/:id',
    Middleware.isAuthenticated,
    payoutRequest.paid,
    Middleware.Response.success('paid')
  );

  route.delete(
    '/v1/payout-request/:id',
    Middleware.isAuthenticated,
    payoutRequest.remove,
    Middleware.Response.success('remove')
  );

  route.get(
    '/v1/payout-request/:id',
    Middleware.isAuthenticated,
    payoutRequest.findOne,
    Middleware.Response.success('findOne')
  );
};
