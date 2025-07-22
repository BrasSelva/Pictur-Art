import { jwtDecode } from 'jwt-decode';

export function getToken() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return user.token || null;
  } catch {
    return null;
  }
}

export function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id || null;
  } catch {
    return null;
  }
}
