const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    type: {
      type: Schema.Types.String,
    },
    metadata: {
      text: Schema.Types.String,
      type: {
        type: Schema.Types.String,
      },
      recipientId: {
        type: Schema.Types.ObjectId,
      },
      senderId: {
        type: Schema.Types.ObjectId,
      },
      fileIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
      }],
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

schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('message', {
  ref: 'Message',
  localField: 'messageId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('conversation', {
  ref: 'Conversation',
  localField: 'conversationId',
  foreignField: '_id',
  justOne: true
});
schema.virtual('files', {
  ref: 'Media',
  localField: 'metadata.fileIds',
  foreignField: '_id',
  justOne: false
});
schema.virtual('recipients', {
  ref: 'User',
  localField: 'metadata.recipientId',
  foreignField: '_id',
  justOne: false
});
schema.virtual('sender', {
  ref: 'User',
  localField: 'metadata.senderId',
  foreignField: '_id',
  justOne: false
});
module.exports = schema;
