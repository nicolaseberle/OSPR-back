/**
 * @module controllers/comments
 */

const Article = require('../Article/model');
const Comment = require('./model');

const CommentValidator = require('./validator');

/* HELPERS */
const renameObjectProperty = require('../../helpers/renameObjectProperty');

const DEFAULT_PAGE_OFFSET = 1;
const DEFAULT_LIMIT = 10;

/**
 *
 * @function getArticleComments
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object}
 */
module.exports.getArticleComments = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || DEFAULT_PAGE_OFFSET;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;

  try {
    const article = await Article.findOne({ slug: req.params.slug }).lean();

    if (!article) return res.boom.notFound();

    const comments = await Comment.paginate({ article }, { page, limit, lean: true });

    renameObjectProperty(comments, 'docs', 'comments');

    return res.status(200).json(comments);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function findComment
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object}
 */
module.exports.findComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id }).lean();

    if (!comment) return res.boom.notFound();

    return res.status(200).json(comment);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function createArticleComment
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object}
 */
module.exports.createArticleComment = async (req, res, next) => {
  try {
    req.check(CommentValidator.checkCommentData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }

    const userId = req.body.userId.trim();
    const content = req.body.content.trim();

    const article = await Article.findOne({ slug: req.params.slug });

    if (!article) return res.boom.notFound();

    const newComment = new Comment({ userId, content, article });
    const comment = await newComment.save();

    article.comments.push(comment);
    await article.save();

    return res.status(201).json(comment);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function findCommentAndUpdate
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object}
 */
module.exports.findCommentAndUpdate = async (req, res, next) => {
  try {
    req.check(CommentValidator.checkCommentData);
    const validationResult = await req.getValidationResult();
    if (!validationResult.isEmpty()) {
      return res.status(400).json({ errors: validationResult.array() });
    }

    const content = req.body.content.trim();

    const comment = await Comment
      .findOneAndUpdate(
        { _id: req.params.id },
        { $set: { content } },
        { new: true }
      );

    if (!comment) return res.sendStatus(404);

    return res.status(200).json(comment);
  } catch (err) {
    return next(err);
  }
};

/**
 *
 * @function findCommentAndDelete
 * @memberof module:controllers/comments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.findCommentAndDelete = async (req, res, next) => {
  try {
    const comment = await Comment.delete({ _id: req.params.id });

    if (comment.n === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
