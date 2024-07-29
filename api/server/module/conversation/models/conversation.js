const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    memberIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
      }
    ],
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    // who have been blocked will be add to this array
    blockedIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    deletedByIds: [{
      type: Schema.Types.ObjectId,
      index: true
    }],
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

schema.virtual('members', {
  ref: 'User',
  localField: 'memberIds',
  foreignField: '_id',
  justOne: false
});

schema.virtual('lastMessage', {
  ref: 'Message',
  localField: 'lastMessageId',
  foreignField: '_id',
  justOne: true
});

module.exports = schema;
