const path = require('path');
const nconf = require('nconf');

// cause we have to run queue with local file, so we will create queue name just for single server
// for scaling, so we will create a random key her as prefix/subfix for some queue
process.env.LOCAL_ID = Math.random()
  .toString(36)
  .substring(7);

nconf
  .argv()
  .env()
  .file({
    file: path.resolve(path.join(__dirname, 'config', `${process.env.NODE_ENV}.json`))
  });

const Kernel = require('./kernel');

const kernel = new Kernel();

kernel.loadModule(require('./module/system'));
kernel.loadModule(require('./module/user'));
kernel.loadModule(require('./module/auth'));
kernel.loadModule(require('./module/post'));
kernel.loadModule(require('./module/media'));
kernel.loadModule(require('./module/newsletter'));
kernel.loadModule(require('./module/banner'));
kernel.loadModule(require('./module/socket'));
kernel.loadModule(require('./module/conversation'));
kernel.loadModule(require('./module/message'));
kernel.loadModule(require('./module/contact'));
kernel.loadModule(require('./module/custome-message'));
kernel.loadModule(require('./module/sell-item'));
kernel.loadModule(require('./module/payment'));
kernel.loadModule(require('./module/purchase'));
kernel.loadModule(require('./module/earning'));
kernel.loadModule(require('./module/payout'));
kernel.loadModule(require('./module/notification'));
kernel.loadModule(require('./module/share-love'));
kernel.loadModule(require('./module/contact-us'));
kernel.loadModule(require('./module/report'));
kernel.loadModule(require('./module/stats'));
// NOTE - compose at last
kernel.compose();

module.exports = kernel;
