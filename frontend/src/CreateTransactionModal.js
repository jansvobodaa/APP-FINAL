import React, { useState } from 'react';
import Modal from './Modal'; 

const CreateTransactionModal = ({ isOpen, onClose, onSave, products }) => {
  const [note, setNote] = useState('');
  const [items, setItems] = useState([{ productId: '', amount: '', isRestock: false }]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'isRestock') {
      newItems[index][field] = value;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productId: '', amount: '', isRestock: false }]);

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
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

    // isRestock === true → amount positive
    // isRestock === false → amount negative (sale)
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

    console.log('Submitting transaction:', transactionData);

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
          <input
            required
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter a note"
          />
        </label>
        <br />
        <div>
          <strong>Items:</strong>
          {items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '0.5em' }}>
              <select
                required
                value={item.productId}
                onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
              >
                <option value="">Select product</option>
                {products.map((p) => (
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
                onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
              />{' '}
              <label style={{ userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={item.isRestock}
                  onChange={(e) => handleItemChange(idx, 'isRestock', e.target.checked)}
                />{' '}
                Restock item
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
        <div style={{ marginTop: '1em' }}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>{' '}
          <button type="submit">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTransactionModal;
