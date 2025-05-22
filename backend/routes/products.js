const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/productController');

//get all products
router.get('/', productController.getAllProducts);

//get product by ID
router.get('/:id', 
  param('id').isString().notEmpty(),
  productController.getProductById
);

//create new product
router.post('/',
  body('name').isString().notEmpty(),
  body('price').isNumeric(),
  productController.createProduct
);

//update product
router.put('/:id',
  param('id').isString().notEmpty(),
  body('name').optional().isString(),
  body('price').optional().isNumeric(),
  productController.updateProduct
);

//delete product
router.delete('/:id', 
  param('id').isString().notEmpty(),
  productController.deleteProduct
);

module.exports = router;
