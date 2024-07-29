const Schema = require('mongoose').Schema;

const schema = new Schema({
  title: { type: String, default: '' },
  path: { type: String, default: '' },
  internal: { type: Boolean, default: false },
  parentId: { type: Schema.Types.ObjectId },
  help: { type: String, default: '' },
  section: { type: String, default: 'footer' },
  public: { type: Boolean, default: true },
  openNewTab: { type: Boolean, default: false },
  ordering: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  restrict: true,
  minimize: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

module.exports = schema;
