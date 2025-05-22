import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './Modal.css';

//modalComponent
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </>,
    document.body
  );
};

//productDetailModal
const ProductDetailModal = ({
  isOpen,
  product,
  onClose,
  onDelete,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price || '');
      setQuantity(product.quantity || '');
      setNote(product.note || '');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = async () => {
    const updatedProduct = {
      ...product,
      name,
      price: Number(price),
      quantity: Number(quantity),
      note,
    };
    await onSave(updatedProduct);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete product "${name}"?`)) {
      await onDelete(product.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details">
      <div>
        <label>
          Note:<br />
          <input value={note} onChange={e => setNote(e.target.value)} />
        </label>
        <br />
        <label>
          Stock (Quantity):<br />
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </label>
        <br />
        <label>
          Name:<br />
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Price (CZK):<br />
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </label>
        <br />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.5em'
        }}>
          <button
            style={{
              background: 'red',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 14px'
            }}
            onClick={handleDelete}
          >
            DELETE PRODUCT
          </button>
          <div>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#d3d3d3',  // light gray
                color: '#000',
                border: 'none',
                borderRadius: 4,
                padding: '8px 14px',
                marginRight: 10,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: '#007bff',  // React blue
                color: 'white',
                border: 'none',
                borderRadius: 4,
                padding: '8px 14px',
                cursor: 'pointer',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

//addProductModal
const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber) || quantityNumber < 0) {
      alert('Please enter a valid non-negative number for quantity');
      return;
    }

    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      alert('Please enter a valid non-negative number for price');
      return;
    }

    const productData = {
      name,
      price: priceNumber,
      quantity: quantityNumber,
      note: note.trim() || ''
    };

    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add product: ${errorText}`);
      }
      onSave();
      onClose();
      setName('');
      setPrice('');
      setQuantity('');
      setNote('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Product">
      <form onSubmit={handleSubmit}>
        <label>
          Name:<br />
          <input required value={name} onChange={e => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Price (CZK):<br />
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </label>
        <br />
        <label>
          Quantity:<br />
          <input
            required
            type="number"
            min="0"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </label>
        <br />
        <label>
          Note:<br />
          <input value={note} onChange={e => setNote(e.target.value)} />
        </label>
        <br />
        <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#d3d3d3',
              color: '#000',
              border: 'none',
              borderRadius: 4,
              padding: '8px 14px',
              marginRight: 10,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

//createTransactionModal
const CreateTransactionModal = ({ isOpen, onClose, onSave, products }) => {
  const [note, setNote] = useState('');
  const [items, setItems] = useState([{ productId: '', amount: '', isRestock: false }]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productId: '', amount: '', isRestock: false }]);
  const removeItem = index => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async e => {
    e.preventDefault();

    if (!note.trim()) {
      alert('Please enter a note.');
      return;
    }

    for (const item of items) {
      if (!item.productId) {
        alert('Please select a product for all items.');
        return;
      }
      const amountNum = Number(item.amount);
      if (!item.amount || isNaN(amountNum) || amountNum <= 0) {
        alert('Please enter a positive number for amount for all items.');
        return;
      }
    }

    const transactionItems = items.map(({ productId, amount, isRestock }) => {
      const amountNum = Number(amount);
      return {
        productId: String(productId),
        amount: isRestock ? Math.abs(amountNum) : -Math.abs(amountNum),
      };
    });

    const transactionData = {
      note: note.trim(),
      timestamp: new Date().toISOString(),
      items: transactionItems,
    };

    try {
      const res = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create transaction: ${errorText}`);
      }
      onSave();
      onClose();
      setNote('');
      setItems([{ productId: '', amount: '', isRestock: false }]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Transaction">
      <form onSubmit={handleSubmit}>
        <label>
          Note:<br />
          <input required value={note} onChange={e => setNote(e.target.value)} />
        </label>
        <br />
        <div>
          <strong>Items:</strong>
          {items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '0.5em' }}>
              <select
                required
                value={item.productId}
                onChange={e => handleItemChange(idx, 'productId', e.target.value)}
              >
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>{' '}
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount"
                value={item.amount}
                onChange={e => handleItemChange(idx, 'amount', e.target.value)}
              />{' '}
              <label style={{ userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={item.isRestock}
                  onChange={e => handleItemChange(idx, 'isRestock', e.target.checked)}
                />{' '}
                Restock (check to make amount positive)
              </label>{' '}
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(idx)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem}>
            Add Item
          </button>
        </div>
        <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#d3d3d3',
              color: '#000',
              border: 'none',
              borderRadius: 4,
              padding: '8px 14px',
              marginRight: 10,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

function App() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCreateTransaction, setShowCreateTransaction] = useState(false);

  //productDetailModal
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = () => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  };

  const fetchTransactions = () => {
    fetch('http://localhost:3000/api/transactions')
      .then(res => res.json())
      .then(setTransactions)
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (showAddProduct || showCreateTransaction || showProductDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showAddProduct, showCreateTransaction, showProductDetail]);

  const filteredTransactions = selectedDate
    ? transactions.filter(tx => {
        const txDate = new Date(tx.timestamp);
        const [year, month] = selectedDate.split('-');
        return (
          txDate.getFullYear() === Number(year) &&
          txDate.getMonth() + 1 === Number(month)
        );
      })
    : transactions;

  //sort by timestamp
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  //show only last 3 transactions
  const lastThreeTransactions = sortedTransactions.slice(0, 3);

  //totalProfits and totalExpenses
  const DISCOUNT_BUY_RATE = 0.45; // 45% buy rate discount
  const totalExpenses = filteredTransactions.reduce((sum, tx) => {
    const expenseAmount = tx.items.reduce((acc, item) => {
      if (item.amount <= 0) return acc;
      const product = products.find(p => String(p.id) === String(item.productId));
      if (!product) return acc;
      const discountedPrice = product.price * (1 - DISCOUNT_BUY_RATE);
      return acc + item.amount * discountedPrice;
    }, 0);
    return sum + expenseAmount;
  }, 0);

  const totalProfits = filteredTransactions.reduce((sum, tx) => {
    const profitAmount = tx.items.reduce((acc, item) => {
      if (item.amount >= 0) return acc;
      const product = products.find(p => String(p.id) === String(item.productId));
      if (!product) return acc;
      return acc + Math.abs(item.amount) * product.price;
    }, 0);
    return sum + profitAmount;
  }, 0);

  //total profit (profits - expenses)
  const totalProfit = totalProfits - totalExpenses;

  //product modal handlers
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'DELETE',
      });
      setShowProductDetail(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      await fetch(`http://localhost:3000/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      setShowProductDetail(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">Tealnv</div>
        <div className="dashboard-date-section">
          <input
            type="month"
            value={selectedDate || ''}
            onChange={e => setSelectedDate(e.target.value)}
            className="dashboard-date-input"
          />
          <span className="dashboard-date-icon" role="img" aria-label="calendar"></span>
        </div>
      </div>

      {/* Total Profit Section */}
      <div className="dashboard-section dashboard-total-profit">
        <h3 style={{margin: 0}}>Total Profit</h3>
        <div className={totalProfit >= 0 ? 'profit-positive' : 'profit-negative'} style={{fontSize: '1.3em', marginTop: 4}}>
          {totalProfit.toLocaleString()} CZK
        </div>
      </div>

      {/* Main Sections */}
      <div className="dashboard-main">
        {/* Last Transactions Section */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <span>Last Transactions:</span>
            <button
              className="dashboard-btn"
              onClick={() => setShowCreateTransaction(true)}
            >
              Create Transaction
            </button>
          </div>
          <div className="dashboard-last-transactions-list">
            {lastThreeTransactions.length === 0 && <p>No transactions found.</p>}
            {lastThreeTransactions.map(tx => (
              <div key={tx.id} className="dashboard-transaction-card">
                <div>
                  <strong>Transaction {tx.id.slice(0, 8)}</strong> - {new Date(tx.timestamp).toLocaleDateString()} -{' '}
                  {tx.items.reduce((sum, item) => {
                    const product = products.find(p => String(p.id) === String(item.productId));
                    return product ? sum + Math.abs(item.amount) * product.price : sum;
                  }, 0)} CZK
                </div>
                <div style={{ fontSize: '0.95em', color: '#333' }}>
                  {tx.items.map((item, idx) => {
                    const product = products.find(p => String(p.id) === String(item.productId));
                    return (
                      <div key={idx}>
                        {Math.abs(item.amount)}x {product ? product.name : 'Unknown Product'}
                      </div>
                    );
                  })}
                  {tx.note && <div style={{ color: '#666' }}>{tx.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <span>Products:</span>
            <button
              className="dashboard-btn"
              onClick={() => setShowAddProduct(true)}
            >
              Add Product
            </button>
          </div>
          <div className="dashboard-products-grid">
            {products.map(p => (
              <div
                className="dashboard-product-card"
                key={p.id}
                onClick={() => handleProductClick(p)}
              >
                <div className="dashboard-product-icon" role="img" aria-label="tea">
                  🍵
                </div>
                <div className="dashboard-product-name">{p.name}</div>
                <div className="dashboard-product-price">{p.price} CZK</div>
                <div className="dashboard-product-qty">Stock: {p.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <div>Expenses: <span className="dashboard-expense">{totalExpenses.toLocaleString()} CZK</span></div>
        <div>Profits: <span className="dashboard-profit">{totalProfits.toLocaleString()} CZK</span></div>
      </div>

      <AddProductModal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSave={fetchProducts}
      />

      <CreateTransactionModal
        isOpen={showCreateTransaction}
        onClose={() => setShowCreateTransaction(false)}
        onSave={() => {
          fetchTransactions();
          fetchProducts();
        }}
        products={products}
      />

      <ProductDetailModal
        isOpen={showProductDetail}
        product={selectedProduct}
        onClose={() => setShowProductDetail(false)}
        onDelete={handleDeleteProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

export default App;
