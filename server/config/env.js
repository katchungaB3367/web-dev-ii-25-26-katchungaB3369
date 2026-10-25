const path = require('node:path');
const dotenv = require('dotenv');

// Resolve from this file so startup works from any working directory.
// Deployment environments should provide their own environment variables.
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.development') });
}

const port = Number(process.env.PORT || 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const databasePort = Number(process.env.DB_PORT || 3306);
if (!Number.isInteger(databasePort) || databasePort < 1 || databasePort > 65535) {
  throw new Error('DB_PORT must be an integer between 1 and 65535.');
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: databasePort,
    name: process.env.DB_NAME || 'student_profiles',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
  },
};
