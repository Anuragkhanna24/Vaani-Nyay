// Place this where you want the logout button, e.g., in Navbar.jsx or a header component

import apiService from '../apiService';

const LogoutButton = () => (
  <button
    onClick={() => apiService.logout()}
    className="px-4 py-2 bg-[#33FEBF] text-white rounded hover:bg-[#2ad1a3] transition"
  >
    Logout
  </button>
);

export default LogoutButton;