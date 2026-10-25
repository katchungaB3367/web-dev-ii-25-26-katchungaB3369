const notFound = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'That email or student number already belongs to a profile.' });
  }
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status <= 599
    ? err.status
    : 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 ? 'Internal server error' : err.message,
  });
};

module.exports = { notFound, errorHandler };
