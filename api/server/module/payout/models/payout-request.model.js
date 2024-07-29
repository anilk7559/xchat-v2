const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    modelId: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'User'
    },
    tokenRequest: {
      type: Number,
      index: true
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'paid', 'approved', 'rejected']
    },
    payoutAccount: { type: Schema.Types.Mixed },
    note: {
      type: String,
      default: ''
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
