const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const authBgImage = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'authBgImage' });
  if (!authBgImage) {
    const count = await DB.collection(COLLECTION.CONFIG).countDocuments({
      group: 'general'
    });
    await DB.collection(COLLECTION.CONFIG).insertOne({
      group: 'general',
      public: true,
      type: 'text',
      key: 'authBgImage',
      value: '',
      name: 'Auth page background image',
      description: 'Custom image background for login, register, forgot password page',
      ordering: count + 1,
      meta: {
        upload: true,
        image: true
      },
      autoload: false
    });
  } else {
    await DB.collection(COLLECTION.CONFIG).updateOne({
      key: 'authBgImage'
    }, {
      group: 'general',
      public: true,
      type: 'text',
      key: 'authBgImage',
      name: 'Auth page background image',
      description: 'Custom image background for login, register, forgot password page',
      ordering: count + 1,
      meta: {
        upload: true,
        image: true
      },
      autoload: false
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
