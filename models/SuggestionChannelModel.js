const { Schema, model } = require('mongoose');

const SuggestionChannelModel = Schema({
  _id: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
});

module.exports = model('SuggestionChannel', SuggestionChannelModel);
