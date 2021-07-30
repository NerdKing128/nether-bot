const { Schema, model } = require('mongoose');

const LockdownIgnoreModel = Schema({
  _id: {
    type: String,
    required: true,
  },
  ignores: {
    type: Array,
    required: true,
  },
});

module.exports = model('LockdownIgnore', LockdownIgnoreModel);
