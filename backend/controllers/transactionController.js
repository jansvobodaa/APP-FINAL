const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const transactionsFile = path.join(__dirname, '../data/transactions.json');
const productsFile = path.join(__dirname, '../data/products.json');


async function loadTransactions() {
  try {
    return await fs.readJson(transactionsFile);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function saveTransactions(transactions) {
  await fs.writeJson(transactionsFile, transactions, { spaces: 2 });
}

async function loadProducts() {
  try {
    return await fs.readJson(productsFile);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function saveProducts(products) {
  await fs.writeJson(productsFile, products, { spaces: 2 });
}

//all transactions controller
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await loadTransactions();
    res.json(transactions);
  } catch (err) {
    console.error('Error loading transactions:', err);
    next(err);
  }
};

//create transaction controller
exports.createTransaction = async (req, res, next) => {
  try {
    const { note, timestamp, items } = req.body;

    if (typeof note !== 'string' || note.trim() === '') {
      return res.status(400).json({ error: 'Invalid or missing note' });
    }

    if (timestamp && isNaN(Date.parse(timestamp))) {
      return res.status(400).json({ error: 'Invalid timestamp format' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' });
    }

    const products = await loadProducts();
    const updatedProducts = [...products];

    for (const item of items) {
      const { productId, amount } = item;

      if (
        productId === undefined ||
        productId === null ||
        (typeof productId !== 'string' && typeof productId !== 'number')
      ) {
        return res.status(400).json({ error: 'Each item must have a valid productId' });
      }

      const trimmedProductId = String(productId).trim();

      const productIndex = updatedProducts.findIndex(
        (p) => String(p.id).trim() === trimmedProductId
      );

      if (productIndex === -1) {
        return res.status(404).json({ error: `Product not found: ${trimmedProductId}` });
      }

      const amountNum = Number(amount);
      if (isNaN(amountNum) || amountNum === 0) {
        return res.status(400).json({ error: 'Each item must have a non-zero numeric amount' });
      }

      const type = amountNum < 0 ? 'sale' : 'restock';

      const product = updatedProducts[productIndex];
      const newQuantity = product.quantity + amountNum;

      if (newQuantity < 0) {
        return res.status(400).json({
          error: `Insufficient stock for product ${trimmedProductId}. Current quantity: ${product.quantity}, requested change: ${amountNum}`
        });
      }

      updatedProducts[productIndex] = { ...product, quantity: newQuantity };
      item.type = type;
    }

    await saveProducts(updatedProducts);

    const transactions = await loadTransactions();

    const newTransaction = {
      id: uuidv4(),
      note: note.trim(),
      timestamp: timestamp || new Date().toISOString(),
      items: items.map(({ productId, amount, type }) => ({
        productId: typeof productId === 'number' ? productId : String(productId),
        amount: Number(amount),
        type,
      })),
    };

    transactions.push(newTransaction);
    await saveTransactions(transactions);

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error('Error creating transaction:', err);
    next(err);
  }
};
