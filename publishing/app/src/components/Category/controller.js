/**
 * @module controllers/categories
 */

const Category = require('./model');
const Article = require('../Article/model');

const CategoryValidator = require('./validator');

/* HELPERS */
const renameObjectProperty = require('../../helpers/renameObjectProperty');

const DEFAULT_PAGE_OFFSET = 1;
const DEFAULT_LIMIT = 10;

/**
 *
 * @function getCategories
 * @memberof module:controllers/categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().lean();

    return res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function getCategoryArticles
 * @memberof module:controllers/categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.getCategoryArticles = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;

  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();

    if (!category) return res.sendStatus(404);

    const articles = await Article
      .paginate(
        { categories: { $in: [category._id] }, deleted: false, published: true },
        { page, limit, lean: true }
      );

    renameObjectProperty(articles, 'docs', 'articles');

    return res.status(200).json(articles);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function createCategory
 * @memberof module:controllers/categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createCategory = async (req, res, next) => {
  try {
    req.check(CategoryValidator.checkCategoryData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }

    const name = req.body.name.trim().toLowerCase();

    const newCategory = new Category({ name });
    const category = await newCategory.save();

    return res.status(201).json(category);
  } catch (err) {
    return next(err);
  }
};
