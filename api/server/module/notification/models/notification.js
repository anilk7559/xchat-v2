const Schema = require('mongoose').Schema;

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  type: {
    type: String,
    index: true
  },
  text: {
    type: String
  },
  userAvartarUrl: {
    type: String
  },
  value: {
    type: Schema.Types.Mixed
  },
  refId: {
    type: Schema.Types.ObjectId
  },
  meta: {
    type: Schema.Types.Mixed
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  byId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('createdBy', {
  ref: 'User',
  localField: 'byId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
