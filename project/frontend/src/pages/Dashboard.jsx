import { useAuth } from '../context/AuthContext';
import ProductList from '../components/ProductList';
import AddProductForm from '../components/AddProductForm';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header>
        <h1>AgriLink Dashboard</h1>
        <p>Welcome, {user.name} ({user.role.toUpperCase()})</p>
        <button onClick={logout}>Logout</button>
      </header>

      {user.role === 'farmer' ? (
        <div>
          <AddProductForm />
          <ProductList myProducts={true} />
        </div>
      ) : (
        <div>
          <ProductList />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
