const { Schema, model } = require('mongoose');

const LogModel = Schema({
  _id: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  staffID: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

module.exports = model('Log', LogModel);
