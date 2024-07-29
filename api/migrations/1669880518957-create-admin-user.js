const {
  DB, COLLECTION, encryptPassword, generateSalt
} = require('./lib');

const defaultPassword = 'adminadmin';

module.exports.up = async function up(next) {
  const salt = generateSalt();
  const password = encryptPassword(defaultPassword, salt);
  const user = {
    firstName: 'Admin',
    lastName: 'Admin',
    email: `admin@${process.env.DOMAIN || 'example.com'}`,
    username: 'admin',
    role: 'admin',
    provider: 'local',
    isActive: true,
    emailVerified: true,
    isApproved: true,
    salt,
    password,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const sources = await DB.collection(COLLECTION.USER).find({
    $or: [{
      email: user.email.toLowerCase()
    }, {
      username: user.username
    }]
  }).toArray();

  if (sources.length) {
    // eslint-disable-next-line no-console
    console.log(`Email ${user.email} have been existed`);
    next();
    return;
  }
  // eslint-disable-next-line no-console
  console.log(`Seeding ${user.username}`);
  await DB.collection(COLLECTION.USER).insertOne(user);
  next();
};

module.exports.down = function down(next) {
  next();
};
