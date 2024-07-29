const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const customHeaderScript = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'headerScript' });
  if (!customHeaderScript) {
    await DB.collection(COLLECTION.CONFIG).insertOne({
      group: 'customScript',
      public: true,
      autoload: false,
      type: 'text',
      key: 'headerScript',
      value: '',
      name: 'Header script',
      description: 'Custom header script. It will be append in <head> tag',
      ordering: 1,
      meta: {
        editor: false,
        textarea: true
      }
    });
  } else {
    await DB.collection(COLLECTION.CONFIG).updateOne({
      key: 'headerScript',
    }, {
      group: 'customScript',
      public: true,
      autoload: false,
      type: 'text',
      key: 'headerScript',
      name: 'Header script',
      description: 'Custom header script. It will be append in <head> tag',
      ordering: 1,
      meta: {
        editor: false,
        textarea: true
      }
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
