const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
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
    }
  }
);

schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('added', {
  ref: 'User',
  localField: 'addedBy',
  foreignField: '_id',
  justOne: true
});
module.exports = schema;
