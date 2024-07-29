const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const siteCommision = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'siteCommision' });
  if (siteCommision) {
    await DB.collection(COLLECTION.CONFIG).deleteOne({ _id: siteCommision._id });
  }

  await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'siteCommission' });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'commission',
    public: false,
    type: 'number',
    key: 'siteCommission',
    value: siteCommision ? siteCommision.value : 0.2,
    name: 'Site commission',
    description: 'Commissin for website when model receives tip or purchase an item. Accept decimal number from 0 - 1. Eg 0.1 means 10%, 0.15 means 15%',
    ordering: 1,
    meta: {
      steps: 3
    }
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
