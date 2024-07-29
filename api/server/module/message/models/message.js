const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    type: {
      type: String,
      enum: ['text', 'photo', 'video', 'file'],
      default: 'text'
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    price: {
      type: Number
    },
    text: {
      type: String
    },
    fileIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Media'
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

schema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('recipient', {
  ref: 'User',
  localField: 'recipientId',
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
  localField: 'fileIds',
  foreignField: '_id',
  justOne: false
});



module.exports = schema;
