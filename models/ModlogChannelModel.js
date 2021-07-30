const { Schema, model } = require('mongoose');

const ModlogChannelModel = Schema({
  _id: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
});

module.exports = model('ModlogChannel', ModlogChannelModel);
