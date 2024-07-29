const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    type: {
      type: String,
      enum: ['paypal', 'paxum', 'bank']
    },
    bankInfo: {
      // use for bank
      bankName: { type: String, default: '' },
      bankAddress: { type: String, default: '' },
      iban: { type: String, default: '' },
      swift: { type: String, default: '' },
      beneficiaryName: { type: String, default: '' },
      beneficiaryAddress: { type: String, default: '' }
    },
    email: {
      // use for paypal/paxum
      type: String,
      default: ''
    },
    modelId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  {
    minimize: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

schema.virtual('model', {
  ref: 'User',
  localField: 'modelId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
