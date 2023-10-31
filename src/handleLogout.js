import axios from 'axios';

export const handleLogout = async (navigate) => {
  try {
    const response = await axios.get('/logout');
    if (response.status === 200) {
      console.log('Logout successful');
      // Clear the session cookie
      document.cookie = 'connect.user_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      sessionStorage.clear();
      localStorage.clear();
      navigate('/');
    } else {
      console.error('Failed to logout:', response.data.error);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};