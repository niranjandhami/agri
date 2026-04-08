import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = ({ myProducts = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch products error', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="products-list">
      <h3>{myProducts ? 'My Products' : 'Available Products'}</h3>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <h4>{product.name}</h4>
            <p>{product.description || 'No description'}</p>
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <small>By Farmer ID: {product.farmer_id}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
