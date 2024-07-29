const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const ccbill = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'ccbillInfo' });
  if (ccbill) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'ccbillInfo' });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'ccbill',
    public: false,
    type: 'text',
    key: 'ccbillSubAccount',
    value: ccbill ? ccbill.value.subAccount : '',
    name: 'Sub account',
    description: 'CCBill sub account number',
    ordering: 1
  });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'ccbill',
    public: false,
    type: 'text',
    key: 'ccbillFlexformId',
    value: ccbill ? ccbill.value.flexformId : '',
    name: 'Flexform ID',
    description: 'CCBill Flexform ID',
    ordering: 2
  });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'ccbill',
    public: false,
    type: 'text',
    key: 'ccbillSalt',
    value: ccbill ? ccbill.value.salt : '',
    name: 'Salt',
    description: 'CCBill salt',
    ordering: 3
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
