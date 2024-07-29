const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const ccbillCurrencyCode = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'ccbillCurrencyCode' });
  if (ccbillCurrencyCode) {
    await DB.collection(COLLECTION.CONFIG).updateOne({
      key: 'ccbillCurrencyCode'
    }, {
      $set: {
        group: 'ccbill',
        public: false,
        type: 'text',
        key: 'ccbillCurrencyCode',
        name: 'Currency code',
        description: 'An integer representing the 3-digit currency code that will be used for the transaction. 978 - EUR, 036 - AUD 124 - CAD, 826 - GBP, 392 - JPY, 840 - USD',
        ordering: 4
      }
    });
    return next();
  }

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'ccbill',
    public: false,
    type: 'text',
    key: 'ccbillCurrencyCode',
    value: '840',
    name: 'Currency code',
    description: 'An integer representing the 3-digit currency code that will be used for the transaction. 978 - EUR, 036 - AUD 124 - CAD, 826 - GBP, 392 - JPY, 840 - USD',
    ordering: 4
  });

  return next();
};

module.exports.down = function down(next) {
  next();
};
