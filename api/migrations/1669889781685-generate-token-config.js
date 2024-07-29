const { DB, COLLECTION } = require('./lib');


module.exports.up = async function up(next) {
  let ordering = 1;

  const freeToken = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'freeToken' });
  if (freeToken) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'freeToken' });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'token',
    public: false,
    type: 'number',
    key: 'freeToken',
    value: freeToken ? freeToken.value : 0,
    name: 'Token free for new register user',
    description: 'Token free for new register user.',
    ordering
  });

  ordering += 1;
  const minPayoutRequest = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'minPayoutRequest' });
  if (minPayoutRequest) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'minPayoutRequest' });
  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'token',
    public: false,
    type: 'number',
    key: 'minPayoutRequest',
    value: minPayoutRequest ? minPayoutRequest.value : 2,
    name: 'Minimum token model can send payout request',
    description: 'Minimum token model can send payout request',
    ordering
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
