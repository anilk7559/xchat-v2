const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const customFooterScript = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'footerScript' });
  if (!customFooterScript) {
    await DB.collection(COLLECTION.CONFIG).insertOne({
      group: 'customScript',
      public: true,
      type: 'text',
      key: 'footerScript',
      value: '',
      name: 'Footer script',
      description: 'Custom footer script. It will be append before <body> tag',
      ordering: 1,
      meta: {
        editor: false,
        textarea: true
      }
    });
  }

  const customFooterContent = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'footerContent' });
  if (!customFooterContent) {
    await DB.collection(COLLECTION.CONFIG).insertOne({
      group: 'customScript',
      public: true,
      type: 'text',
      key: 'footerContent',
      value: `<p style="text-align:center;"><strong>${process.env.DOMAIN || ''} © Copyright 20231111. All Rights Reserved</strong></p>
      <p style="text-align:center;"><img src="https://www.dmca.com/img/dmca_logo.png?=sd" alt="DCMA" style="height:auto;width:70px;display:block;margin:0 auo"/></p>`,
      name: 'Footer content',
      description: 'Custom footer content, it will be showed in the bottom of site',
      ordering: 2,
      meta: {
        editor: true
      }
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};

