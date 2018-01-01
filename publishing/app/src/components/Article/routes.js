const router = require('express').Router();

const articlesController = require('./controller');

router.get('/', articlesController.getArticles);
router.get('/:slug', articlesController.findArticleBySlug);
router.post('/', articlesController.createArticle);
router.put('/:slug', articlesController.findArticlebySlugAndUpdate);
router.delete('/:slug', articlesController.findArticleBySlugAndDelete);

router.put('/:slug/toggle', articlesController.findArticleBySlugAndTogglePublished);

router.get('/:slug/categories', articlesController.findArticleBySlugAndFetchCategories);
router.put('/:slug/categories', articlesController.findArticleBySlugAndAddCategoryBySlug);
router.delete('/:slug/categories', articlesController.findArticleBySlugAndRemoveCategoryBySlug);

module.exports = router;
