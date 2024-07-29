const { DB, COLLECTION } = require('./lib');


module.exports.up = async function up(next) {
  const photoResizeBackgroundColor = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'photoResizeBackgroundColor' });
  if (photoResizeBackgroundColor) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'photoResizeBackgroundColor' });
  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'image',
    public: false,
    type: 'text',
    key: 'photoResizeBackgroundColor',
    value: photoResizeBackgroundColor ? photoResizeBackgroundColor.value : 'transparent',
    name: 'Photo resize background color',
    description: 'Please use "transparent" or hex color code.',
    ordering: 1
  });

  const photoThumbSize = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'photoThumbSize' });
  if (photoThumbSize) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'photoThumbSize' });
  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'image',
    public: false,
    type: 'text',
    key: 'photoThumbSize',
    value: photoThumbSize ? `${photoThumbSize.value.width || 200}x${photoThumbSize.value.height || 200}` : '200x200',
    name: 'Default thumbnail size',
    description: 'Default thumbnail size in format [width]x[height]. System will crop uploaded image to this demension',
    ordering: 2
  });

  const avatarSize = await DB.collection(COLLECTION.CONFIG).findOne({ key: 'avatarSize' });
  if (avatarSize) await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'avatarSize' });

  await DB.collection(COLLECTION.CONFIG).insertOne({
    group: 'image',
    public: false,
    type: 'text',
    key: 'avatarSize',
    value: avatarSize ? `${avatarSize.value.width || 200}x${avatarSize.value.height || 200}` : '200x200',
    name: 'Avatar size',
    description: 'Avatar size in format [width]x[height]. Avatar size should not larger than 500 pixels. Recommend 150x150 to 250x250 pixels. System will crop avatar upload to this demension',
    ordering: 3
  });

  await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'certificationSize' });
  await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'photoMediumSize' });
  await DB.collection(COLLECTION.CONFIG).deleteOne({ key: 'completeProfilePhotoNum' });

  next();
};

module.exports.down = function down(next) {
  next();
};
