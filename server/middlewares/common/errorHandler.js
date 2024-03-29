const createError = require("http-errors");

// 404 not found error handling
function notFoundHandler(req, res, next) {
  next(createError(404, "Not found"));
}

// default error handler
function errorHandler(err, req, res, next) {
  res.locals.error =
    process.env.NODE_ENV === "development"
      ? err
      : {
          message: err.message,
        };

  res.status(err.status || 500);
  res.json(res.locals.error);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
