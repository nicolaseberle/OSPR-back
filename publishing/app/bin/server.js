/*
 * DEPENDENCIES
 */
const app = require('../src/app');
const debug = require('debug')('server');
const http = require('http');

const server = http.createServer(app);

function normalizePort(value) {
  const port = parseInt(value, 10);

  if (port.isNaN) {
    return value;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

const port = normalizePort(process.env.PORT || '1337');
app.set('port', port);

/*
 * Events
 */

function onError(err) {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;
  /* eslint-disable no-console */
  switch (err.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
  /* eslint-enable no-console */
}

function onListening() {
  const address = server.address();
  const bind = typeof address === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  debug(`Listening on: ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

module.exports = server;
