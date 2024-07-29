const Schema = require('mongoose').Schema;

const schema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  reporterId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  target: {
    type: String
  },
  targetId: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: String,
    index: true,
    default: 'awaiting'
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

module.exports = schema;
