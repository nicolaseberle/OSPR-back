const router = require('express').Router();

const miscEndpoint = require('./components/Misc/routes');
const articlesEndpoint = require('./components/Article/routes');
const commentsEndpoint = require('./components/Comment/routes');
const categoriesEndpoint = require('./components/Category/routes');

router.use('/', miscEndpoint);
router.use('/articles', articlesEndpoint);
router.use('/categories', categoriesEndpoint);

// we keep the "/articles" prefix for these resources
router.use('/articles', commentsEndpoint);

module.exports = router;
