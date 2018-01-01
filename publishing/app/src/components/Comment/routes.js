const router = require('express').Router();

const commentsController = require('./controller');

router.get('/:slug/comments', commentsController.getArticleComments);
router.get('/:slug/comments/:id', commentsController.findComment);
router.post('/:slug/comments', commentsController.createArticleComment);
router.put('/:slug/comments/:id', commentsController.findCommentAndUpdate);
router.delete('/:slug/comments/:id', commentsController.findCommentAndDelete);

module.exports = router;
