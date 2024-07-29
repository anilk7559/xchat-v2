const { DB, COLLECTION } = require('./lib');


module.exports.up = async function up(next) {
  const adminEmail = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'adminEmail' });
  if (adminEmail) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'adminEmail' });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'email',
    public: false,
    type: 'text',
    key: 'adminEmail',
    value: adminEmail ? adminEmail.value : `admin@${process.env.DOMAIN}`,
    name: 'Admin email',
    description: 'Email will receive notification from site events such as contact, payment notification.',
    ordering: 1
  });

  const senderEmail = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'senderEmail' });
  if (senderEmail) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'senderEmail' });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'email',
    public: false,
    type: 'text',
    key: 'senderEmail',
    value: senderEmail ? senderEmail.value : `noreply@${process.env.DOMAIN}`,
    name: 'Sender email',
    description: 'Sender email address. This email must matched with email of SMTP account. You can use format "your name" <email-address> to admin email and sender email. Eg "xChat support" <admin@myxchat.info>',
    ordering: 1
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
