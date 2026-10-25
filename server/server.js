const { port } = require('./config/env');
const app = require('./app');

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Unable to start API:', error.message);
  process.exitCode = 1;
});
