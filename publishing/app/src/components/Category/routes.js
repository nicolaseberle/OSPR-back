const router = require('express').Router();

const categoriesController = require('./controller');

router.get('/', categoriesController.getCategories);
router.get('/:slug', categoriesController.getCategoryArticles);
router.post('/', categoriesController.createCategory);

module.exports = router;
