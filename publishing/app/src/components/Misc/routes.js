const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Publishing service misc endpoint',
  });
});

module.exports = router;
