const express = require('express');
const cors = require('cors');
const { clientOrigin } = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '100kb' }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
