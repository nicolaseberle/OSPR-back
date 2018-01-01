module.exports.checkCategoryData = {
  name: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Invalid category name',
  },
};
