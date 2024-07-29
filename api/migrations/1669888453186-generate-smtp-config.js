const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  const smtpCheck = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'smtpInfo' });
  const smtpInfo = smtpCheck ? {
    host: smtpCheck.value.host,
    port: smtpCheck.value.port,
    username: smtpCheck.value.username,
    password: smtpCheck.value.password
  } : {
    host: '',
    port: '',
    username: '',
    password: ''
  };
  if (smtpCheck) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'smtpInfo' });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'smtp',
    public: false,
    type: 'text',
    key: 'smtpHost',
    value: smtpInfo.host,
    description: 'SMTP host',
    name: 'SMTP host',
    ordering: 1
  });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'smtp',
    public: false,
    type: 'number',
    key: 'smtpPort',
    value: smtpInfo.port,
    description: 'SMTP port (25, 587, 465)',
    name: 'SMTP port',
    ordering: 2
  });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'smtp',
    public: false,
    type: 'text',
    key: 'smtpUsername',
    value: smtpInfo.username,
    description: 'SMTP login username.',
    name: 'SMTP username',
    ordering: 3
  });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'smtp',
    public: false,
    type: 'text',
    key: 'smtpPassword',
    value: smtpInfo.password,
    description: 'SMTP login password.',
    name: 'SMTP password',
    ordering: 4
  });

  await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'sparkpostApiKey' });
  await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'sendgridApiKey' });
  await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'mailService' });

  next();
};

module.exports.down = function down(next) {
  next();
};
