const { check, validationResult } = require('express-validator')

const checks = [
  check('title', 'Journal title is required')
    .trim()
    .not()
    .isEmpty(),
  check('content', 'Journal content is required')
    .trim()
    .not()
    .isEmpty(),
]

const validation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }
  next()
}

module.exports = [...checks, validation]
