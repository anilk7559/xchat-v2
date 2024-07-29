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
    type: {
      type: String,
      enum: ['send_message', 'purchase_media', 'share_love'],
      index: true
    },
    commission: {
      type: Number
    },
    token: {
      type: Number
    },
    balance: {
      type: Number
    },
    itemId: {
      type: Schema.Types.Mixed,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'requesting'],
      default: 'pending',
      index: true
    },
    requestId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    restrict: true,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    toJSON: {
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
