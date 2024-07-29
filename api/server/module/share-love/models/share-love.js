/* eslint no-param-reassign: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
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
    token: {
      type: Number,
      default: 0
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
