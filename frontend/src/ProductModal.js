import React, { useState, useEffect } from 'react';

const ProductModal = ({ product, onClose, onDelete, onSave }) => {
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (product) {
      setNote(product.note || '');
      setQuantity(product.quantity || 0);
      setName(product.name || '');
      setPrice(product.price || 0);
    }
  }, [product]);

  if (!product) return null; 

  const handleSave = () => {
    onSave({
      ...product,
      note,
      quantity: Number(quantity),
      name,
      price: Number(price),
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 400, padding: 20, background: 'white', borderRadius: 8 }}>
        <h2>Product Details</h2>

        <label>
          Note:<br />
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} style={{ width: '100%' }} />
        </label>

        <label>
          Stock (Quantity):<br />
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            min="0"
            style={{ width: '100%' }}
          />
        </label>

        <label>
          Name:<br />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>

        <label>
          Price:<br />
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            min="0"
            step="0.01"
            style={{ width: '100%' }}
          />
        </label>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button
            onClick={handleDelete}
            style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 4 }}
          >
            DELETE PRODUCT
          </button>

          <div>
            <button
              onClick={onClose}
              style={{ marginRight: 10, padding: '8px 12px', borderRadius: 4 }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 4 }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Modal overlay styling */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default ProductModal;
