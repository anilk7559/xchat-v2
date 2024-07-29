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
    itemId: {
      type: Schema.Types.ObjectId
    },
    status: {
      type: String,
      index: true,
      enum: ['pending', 'cancelled', 'completed'],
      default: 'pending'
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
      type: String, // payment gateway
      enum: ['ccbill'],
      default: 'ccbill'
    },
    paymentResponse: {
      type: Schema.Types.Mixed
    },
    paymentId: {
      type: String,
      index: true
    },
    // for paypal...
    paymentToken: {
      type: String,
      index: true
    },
    // it is agreement id of paypal of subscription id of ccbill
    paymentAgreementId: {
      type: String
    },
    histories: {
      // history for each webhook call
      type: Array,
      default: []
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
    }
  }
);

module.exports = schema;
