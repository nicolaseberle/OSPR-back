const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: 'title',
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  published: {
    type: Boolean,
    required: true,
    default: false,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  // authors: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Author',
  // }],
  // DOI: {
  //   type: String,
  //   required: true,
  // },
}, {
  timestamps: true,
});

ArticleSchema.plugin(mongooseDelete, { deletedAt: true });
ArticleSchema.plugin(mongoosePaginate);

/**
 * @class Article
 */
const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
