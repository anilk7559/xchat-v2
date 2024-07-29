const args = process.argv.slice(2);
const path = require('path');

require('dotenv').config();

require('./app');

if (args.length && args[0]) {
  setTimeout(async () => {
    // eslint-disable-next-line import/no-dynamic-require
    await require(path.join(__dirname, 'scripts', args[0]))();

    console.log('Script done');
    process.exit();
  });
} else {
  console.log('Please enter script...');
  process.exit();
}
