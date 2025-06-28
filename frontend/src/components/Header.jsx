import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToContact = () => {
    if (window.location.pathname === "/") {
      const contact = document.getElementById("contact");
      if (contact) {
        contact.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollToContact: true } });
    }
  };

  return (
    <header>
      <nav className="bg-[#141E28] shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-balance-scale text-[#33FEBF] text-2xl mr-2"></i>
                <span className="text-xl font-bold text-[#33FEBF]">Vaani-Nyay</span>
              </div>
            </div>

            {/* Primary Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className={`px-1 transition-all duration-200 ${
                  isActive('/') ? 'text-[#33FEBF] font-medium border-b-2 border-[#33FEBF]' : 'text-white hover:text-[#33FEBF]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`px-1 transition-all duration-200 ${
                  isActive('/login') ? 'text-[#33FEBF] font-medium border-b-2 border-[#33FEBF]' : 'text-white hover:text-[#33FEBF]'
                }`}
              >
                Apply Now
              </button>
              <button
                onClick={scrollToContact}
                className="text-white hover:text-[#33FEBF] transition-colors duration-200 px-1"
              >
                Contact Us
              </button>
              <button
                onClick={() => navigate('/about')}
                className={`px-1 transition-all duration-200 ${
                  isActive('/about') ? 'text-[#33FEBF] font-medium border-b-2 border-[#33FEBF]' : 'text-white hover:text-[#33FEBF]'
                }`}
              >
                About us
              </button>
              <button
                onClick={() => navigate('/track-cases')}
                className={`px-1 transition-all duration-200 ${
                  isActive('/track-cases') ? 'text-[#33FEBF] font-medium border-b-2 border-[#33FEBF]' : 'text-white hover:text-[#33FEBF]'
                }`}
              >
                Track Your Case
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`px-4 py-1.5 rounded-lg font-medium transition-colors duration-200 ${
                  isActive('/login') ? 'bg-[#2ae8af] text-[#141E28]' : 'bg-[#33FEBF] text-[#141E28] hover:bg-[#2ae8af]'
                }`}
              >
                Login
              </button>
            </div>

            {/* Mobile button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-white hover:text-[#33FEBF] hover:bg-[#1e2a38] focus:outline-none transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-[#141E28] shadow-lg transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/') ? 'text-[#33FEBF] bg-[#2a3a4d]' : 'text-white hover:text-[#33FEBF] hover:bg-[#1e2a38]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/login') ? 'text-[#33FEBF] bg-[#2a3a4d]' : 'text-white hover:text-[#33FEBF] hover:bg-[#1e2a38]'
              }`}
            >
              Apply Now
            </button>
            <button
              onClick={() => { scrollToContact(); setIsMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-[#33FEBF] hover:bg-[#1e2a38] transition-colors duration-200"
            >
              Contact Us
            </button>
            <button
              onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/about') ? 'text-[#33FEBF] bg-[#2a3a4d]' : 'text-white hover:text-[#33FEBF] hover:bg-[#1e2a38]'
              }`}
            >
              About
            </button>
            <button
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/login') ? 'text-[#33FEBF] bg-[#2a3a4d]' : 'text-white hover:text-[#33FEBF] hover:bg-[#1e2a38]'
              }`}
            >
              Login
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
