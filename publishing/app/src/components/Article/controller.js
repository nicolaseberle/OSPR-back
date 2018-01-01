/**
 * @module controllers/articles
 */

const Article = require('./model');
const Category = require('../Category/model');

const ArticleValidator = require('./validator');

/* HELPERS */
const renameObjectProperty = require('../../helpers/renameObjectProperty');

const DEFAULT_PAGE_OFFSET = 1;
const DEFAULT_LIMIT = 10;

/**
 * getArticles - Returns an array of articles requested with a page offset and limit,
 * so that results are paginated
 *
 * @function getArticles
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.getArticles = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;

  try {
    const articles = await Article.paginate({ deleted: false, published: true }, { page, limit, lean: true });

    renameObjectProperty(articles, 'docs', 'articles');

    return res.status(200).json(articles);
  } catch (err) {
    return next(err);
  }
};

/**
 * getArticleBySlug - Returns an article requested by slug
 *
 * @function getArticleBySlug
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true }).lean();

    if (!article) return res.sendStatus(404);

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};

/**
 * @function createArticle
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createArticle = async (req, res, next) => {
  try {
    req.check(ArticleValidator.checkArticleData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }

    const title = req.body.title.trim();
    const abstract = req.body.abstract.trim();
    const content = req.body.content.trim();

    const newArticle = new Article({ title, abstract, content });
    const article = await newArticle.save();

    return res.status(201).json(article);
  } catch (err) {
    return next(err);
  }
};

/**
 * @function findArticleBySlugAndUpdate
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticlebySlugAndUpdate = async (req, res, next) => {
  try {
    req.check(ArticleValidator.checkArticleData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }

    const title = req.body.title.trim();
    const abstract = req.body.abstract.trim();
    const content = req.body.content.trim();

    const article = await Article
      .findOneAndUpdate(
        { slug: req.params.slug },
        { $set: { title, abstract, content } },
        { new: true }
      );

    if (!article) return res.sendStatus(404);

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function findArticleBySlugAndDelete
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticleBySlugAndDelete = async (req, res, next) => {
  try {
    const article = await Article.delete({ slug: req.params.slug });

    if (article.n === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function findArticleBySlugAndTogglePublished
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticleBySlugAndTogglePublished = async (req, res, next) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug });

    if (!article) return res.sendStatus(404);

    article.published = !article.published;
    article = await article.save();

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function findArticleBySlugAndFetchCategories
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticleBySlugAndFetchCategories = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).lean();

    if (!article) return res.sendStatus(404);

    const categories = await Category.find({ articles: { $in: [article._id] } }).lean();

    return res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function findArticleBySlugAndAddCategoryBySlug
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticleBySlugAndAddCategoryBySlug = async (req, res, next) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug }).lean();

    if (!article) return res.sendStatus(404);

    const category = await Category
      .findOneAndUpdate(
        { slug: req.body.slug },
        { $addToSet: { articles: article } },
        { new: true }
      );

    article = await Article
      .findOneAndUpdate(
        { slug: req.params.slug },
        { $addToSet: { categories: category } },
        { new: true }
      );

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function findArticleBySlugAndRemoveCategoryBySlug
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findArticleBySlugAndRemoveCategoryBySlug = async (req, res, next) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug }).lean();

    if (!article) return res.sendStatus(404);

    const category = await Category
      .findOneAndUpdate(
        { slug: req.body.slug },
        { $pull: { articles: article.id } },
        { new: true }
      );

    if (!category) return res.sendStatus(404);

    article = await Article
      .findOneAndUpdate(
        { slug: req.params.slug },
        { $pull: { categories: category.id } },
        { new: true }
      );

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};
