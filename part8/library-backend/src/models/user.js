const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
  },
  favoriteGenre: {
    type: String,
    required: true
  },
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);