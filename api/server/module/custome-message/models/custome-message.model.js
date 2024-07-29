const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    message: String,
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
    }
  }
);

module.exports = schema;
