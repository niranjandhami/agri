import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Join AgriLink</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="farmer">Farmer</option>
          <option value="buyer">Buyer</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      {error && <p>{error}</p>}
      <p><a href="/login">Have account? Login</a></p>
    </div>
  );
};

export default Signup;
