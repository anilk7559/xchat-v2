const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    type: {
      type: String,
      enum: ['token_package'],
      default: 'token_package'
    },
    price: {
      type: Number
    },
    description: {
      type: String
    },
    currency: {
      type: String,
      default: 'usd'
    },
    products: {
      type: Array,
      default: []
    },
    gateway: {
      type: String // payment gateway
    },
    transactionId: {
      type: Schema.Types.ObjectId
    },
    meta: {
      type: Schema.Types.Mixed
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
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

module.exports = schema;
