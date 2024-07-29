const { DB, COLLECTION } = require('./lib');

module.exports.up = async function (next) {
  await DB.collection(COLLECTION.USER).updateMany({}, {
    $rename: {
      availableToken: 'balance'
    }
  });
  next();
};

module.exports.down = function (next) {
  next();
};
