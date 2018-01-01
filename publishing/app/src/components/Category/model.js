const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: 'name',
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
}, {
  timestamps: true,
});

CategorySchema.plugin(mongooseDelete, { deletedAt: true });

/**
 * @class Category
 */
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
