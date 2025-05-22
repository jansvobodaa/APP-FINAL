import React, { useState } from 'react';
import Modal from './Modal';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [notes, setNotes] = useState('');



    const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
        name,
        price: Number(price),
        stock: Number(stock),
        notes: notes ? [notes] : []
    };
    try {
        const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to add product');
        onSave();
        onClose();
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
            <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
        </label>
        <br />
        <label>
            Stock:<br />
            <input required type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} />
        </label>
        <br />
        <label>
            Notes:<br />
            <input value={notes} onChange={e => setNotes(e.target.value)} />
        </label>
        <br />
        <div style={{ marginTop: '1em' }}>
            <button type="button" onClick={onClose}>Cancel</button>{' '}
            <button type="submit">Save</button>
        </div>
    </form>
    </Modal>
    );
};

export default AddProductModal;
