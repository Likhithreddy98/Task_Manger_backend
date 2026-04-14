const ApiError = require('../utils/ApiError');


const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join('. ');
      return next(new ApiError(400, messages));
    }


    req.body = value;
    next();
  };
};

module.exports = validate;
