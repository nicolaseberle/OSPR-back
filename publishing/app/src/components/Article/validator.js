module.exports.checkArticleData = {
  title: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Invalid title',
  },
  abstract: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Invalid abstract',
  },
  content: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Invalid content',
  },
};
