/* eslint-disable arrow-parens */
const payoutRequest = require('../controllers/payout-account.controller');

module.exports = route => {
  route.post(
    '/v1/payout-account',
    Middleware.isAuthenticated,
    payoutRequest.createAndUpdate,
    Middleware.Response.success('data')
  );

  route.get(
    '/v1/payout-account/:id',
    Middleware.hasRole('admin'),
    payoutRequest.findOne,
    Middleware.Response.success('findOne')
  );

  route.get(
    '/v1/payout-account',
    Middleware.isAuthenticated,
    payoutRequest.findOne,
    Middleware.Response.success('findOne')
  );
};
