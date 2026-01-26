function notFoundHandler(req, res) {
  res.status(404).json({ error: { message: 'Not found' } });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 400;
  const payload = {
    error: {
      message: err.message || 'Unexpected error',
    },
  };

  if (err.details) {
    payload.error.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status).json(payload);
}

module.exports = { errorHandler, notFoundHandler };
