import { useState } from 'react';
import axios from 'axios';

const AddProductForm = () => {
  const [form, setForm] = useState({ name: '', description: '', price: 0, quantity: 0 });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', form);
      setMessage('Product added!');
      setForm({ name: '', description: '', price: 0, quantity: 0 });
    } catch (err) {
      setMessage('Add failed');
    }
  };

  return (
    <div className="add-product">
      <h3>Add Product</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({...form, price: parseFloat(e.target.value) || 0})}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 0})}
        />
        <button type="submit">Add</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProductForm;
