/*
 * DEPENDENCIES
 */
const express = require('express');

const app = express();

/*
 * DB CONNECTION
 */
require('../config/database');

/*
 * MIDDLEWARES
 */
const bodyParser = require('body-parser');
const morgan = require('morgan');
const boom = require('express-boom');
const expressValidator = require('express-validator');
const cors = require('cors');

const checkApiKey = require('./middlewares/checkApiKey');

app.use(morgan('dev'));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(boom());

app.use(expressValidator());

app.use(checkApiKey);

/*
 * ROUTING
 */
const router = require('./router');

app.use('/', router);

// 404 handling
app.use((req, res) => res.boom.notFound());

if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    const statusCode = err.status || 500;
    res.boom.create(statusCode, err.message, err);
  });
}

app.use((err, req, res) => {
  const statusCode = err.status || 500;
  res.boom.create(statusCode, err.message);
});

module.exports = app;
