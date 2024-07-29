const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  // move sitename, logo, favicon, transparent logo to general config
  await DB.collection(COLLECTION.CONFIG).updateMany({
    key: {
      $in: ['siteName', 'siteLogo', 'transparentLogo', 'siteFavicon']
    }
  }, {
    $set: {
      group: 'general'
    }
  });

  const siteName = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'siteName' });
  if (!siteName) {
    await DB.collection(COLLECTION.CONFIG).insertOne({
      group: 'general',
      public: true,
      type: 'text',
      key: 'siteName',
      value: "xChat - World's Best Sexting App",
      name: 'Site name',
      ordering: 1,
      autoload: true
    });
  }

  let ordering = 2;
  [{
    key: 'siteLogo',
    name: 'Site logo',
    description: 'Main logo',
    value: `https://${process.env.DOMAIN}/logo.png`
  }, {
    key: 'transparentLogo',
    name: 'Transparent logo',
    description: 'Transparent logo, use in some sections',
    value: `https://${process.env.DOMAIN}/logo.png`
  }, {
    key: 'siteFavicon',
    name: 'Site favicon',
    description: 'Site favicon. Upload .ico file or png 64x64 pixels',
    value: `https://${process.env.DOMAIN}/favicon.ico`
  }].reduce(async (lp, data) => {
    await lp;
    const check = await DB.collection(COLLECTION.CONFIG).findOne({ key: data.key });
    if (!check) {
      await DB.collection(COLLECTION.CONFIG).insertOne({
        group: 'general',
        public: true,
        type: 'text',
        key: data.key,
        value: '',
        name: data.name,
        description: data.description,
        meta: {
          upload: true,
          image: true
        },
        ordering,
        autoload: true
      });

      ordering += 1;
    } else {
      await DB.collection(COLLECTION.CONFIG).updateOne({
        key: data.key
      }, {
        $set: {
          group: 'general',
          public: true,
          type: 'text',
          key: data.key,
          name: data.name,
          description: data.description,
          meta: {
            upload: true,
            image: true
          },
          ordering,
          autoload: true
        }
      });

      ordering += 1;
    }
    return Promise.resolve();
  }, Promise.resolve());

  next();
};

module.exports.down = function down(next) {
  next();
};
