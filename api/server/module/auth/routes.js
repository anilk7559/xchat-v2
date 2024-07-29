const authController = require('./auth.controller');
const localController = require('./local');

module.exports = (router) => {
  router.post('/v1/auth/admin-login', localController.adminLogin, Middleware.Response.success('adminLogin'));

  router.post('/v1/auth/login', localController.login, Middleware.Response.success('login'));

  router.post('/v1/auth/register', authController.register, Middleware.Response.success('register'));

  router.post('/v1/auth/verify/code', localController.verifyMail, Middleware.Response.success('verifyCode'));
  router.get('/v1/users/search/testing', localController.userSearchTest);

  router.get('/v1/auth/verifyEmail/:token', authController.verifyEmailView);

  router.post('/v1/auth/forgot', authController.forgot, Middleware.Response.success('forgot'));

  router.use('/v1/auth/passwordReset/:token', authController.resetPasswordView);
};
