const { Schema, model } = require('mongoose');

const SuggestionModel = Schema({
  _id: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  messageID: {
    type: String,
    required: true,
  },
});

module.exports = model('Suggestion', SuggestionModel);
