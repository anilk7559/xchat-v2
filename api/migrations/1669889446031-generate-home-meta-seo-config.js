const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const homeSEO = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'homeSEO' });
  if (homeSEO) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'homeSEO' });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'seo',
    public: true,
    type: 'text',
    key: 'homeTitle',
    value: 'World\'s Best Sexting App',
    name: 'Home title',
    description: 'Page title to home page.',
    ordering: 1,
    autoload: false
  });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'seo',
    public: true,
    type: 'text',
    key: 'homeKeywords',
    value: '',
    name: 'Home meta keywords',
    description: 'Home page meta keywords.',
    ordering: 1,
    autoload: false
  });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'seo',
    public: true,
    type: 'text',
    key: 'homeDescription',
    value: '',
    name: 'Home meta description',
    description: 'Home page meta description.',
    ordering: 1,
    autoload: false
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
