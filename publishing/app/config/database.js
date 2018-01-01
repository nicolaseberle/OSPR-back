const mongoose = require('mongoose');
const dbConfig = require('./index').db;

mongoose.Promise = global.Promise;

/*
 * Mongo connection url build
 */
const port = (dbConfig.port.length > 0) ? ':' + dbConfig.port : '';
const login = (dbConfig.user.length > 0) ? dbConfig.user + ':' + dbConfig.pw + '@' : '';
const uristring = `mongodb://${login}${dbConfig.host}${port}/${dbConfig.db}-${process.env.NODE_ENV}`;


const mongoOptions = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  db: { safe: true }
};

mongoose.connect(uristring, mongoOptions);

const dbConnect = mongoose.connection;

dbConnect.on('error', (err) => {
  if (err) {
    console.error(err.message);
  }
});
