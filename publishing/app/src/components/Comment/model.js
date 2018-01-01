const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CommentSchema = Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
}, {
  timestamps: true,
});

CommentSchema.plugin(mongooseDelete, { deletedAt: true });
CommentSchema.plugin(mongoosePaginate);

/**
 * @class Comment
 */
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
