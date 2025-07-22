import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = user?.token;

  return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
