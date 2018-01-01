module.exports.checkCommentData = {
  userId: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Invalid user id',
  },
  content: {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Invalid content',
  },
};
