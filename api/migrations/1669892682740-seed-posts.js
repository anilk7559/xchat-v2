const { DB, COLLECTION } = require('./lib');

const content =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const type = 'page';

module.exports.up = async function up(next) {
  const faq = await DB.collection(COLLECTION.POST).findOne({ alias: 'faqs' });
  if (!faq) {
    await DB.collection(COLLECTION.POST).insertOne({
      title: 'FAQs',
      alias: 'faqs',
      type,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  const terms = await DB.collection(COLLECTION.POST).findOne({ alias: 'terms' });
  if (!terms) {
    await DB.collection(COLLECTION.POST).insertOne({
      title: 'Terms',
      alias: 'terms',
      type,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  const privacy = await DB.collection(COLLECTION.POST).findOne({ alias: 'privacy-policy' });
  if (!privacy) {
    await DB.collection(COLLECTION.POST).insertOne({
      title: 'Privacy policy',
      alias: 'privacy-policy',
      type,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
