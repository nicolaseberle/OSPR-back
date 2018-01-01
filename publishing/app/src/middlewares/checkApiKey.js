const config = require('../../config');

const checkApiKey = (req, res, next) => {
  const apiKey = req.get(config.apiKeyHeader);

  if (apiKey) {
    if (apiKey !== config.apiKey) {
      return res.status(401).json({ message: 'Access Failure' });
    }

    return next();
  }

  return res.status(403).json({ message: 'No API key provided' });
};

module.exports = checkApiKey;
