const appError = require("../utils/appError");

// Middleware to check if the user has the allowed role
module.exports = (...Role) => {
  return (req, res, next) => {
        if (!Role.includes(req.decoded.role)) {
        const error = appError.create(
            403,
            "Forbidden",
            "You do not have permission to access this resource",
        );
        return next(error);
        }
    next();
  };
};
