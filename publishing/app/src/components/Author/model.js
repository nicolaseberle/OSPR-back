const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  _uid: {
    type: String,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

/**
 * @class Author
 */
const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
