const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    user_id: {
      type: String
    },
    model_id: {
      type:String,
    },
    request_url: {
      type: String
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

module.exports = schema;
