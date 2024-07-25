const { body, validationResult } = require("express-validator");

const userValidationRules = [
  body("email").notEmpty().isEmail(),
  body("firstName").notEmpty().isString(),
  body("lastName").notEmpty().isString(),
  body("password").notEmpty().isString(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  const errorsArray = []
  errors.array().map(err => errorsArray.push({ [err.path]: err.msg }))
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).json({ errors: errorsArray });
};

const loginValidationRules = [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isString()
]

const refreshTokenValidationRules = [
    body('refreshToken').notEmpty().isUUID()
]

module.exports = {
  userValidationRules,
  loginValidationRules,
  refreshTokenValidationRules,
  validate,
};
