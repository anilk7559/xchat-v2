/* eslint no-param-reassign: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    mediaId: {
      type: Schema.Types.ObjectId,
      ref: 'Media'
    },
    sellItemId: {
      type: Schema.Types.ObjectId,
      ref: 'SellItem'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    modelId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    mediaType: {
      type: String,
      default: '',
      index: true
    },
    price: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'purchase-media',
      enum: ['purchase-media']
    },
    name: {
      type: String
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);
schema.virtual('media', {
  ref: 'Media',
  localField: 'mediaId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('sellItem', {
  ref: 'SellItem',
  localField: 'sellItemId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('model', {
  ref: 'User',
  localField: 'modelId',
  foreignField: '_id',
  justOne: true
});
module.exports = schema;
