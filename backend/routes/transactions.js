const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { createTransaction, getAllTransactions } = require('../controllers/transactionController');

router.get('/', getAllTransactions);

router.post(
  '/',
  body('note').isString().notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isString().notEmpty(),
  body('items.*.amount').isNumeric().custom(value => value !== 0),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createTransaction
);

module.exports = router;
