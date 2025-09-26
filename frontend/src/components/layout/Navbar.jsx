import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--bg-light)',
      borderBottom: '1px solid var(--neutral-light-color)'
    }} className="shadow-sm">
      <div className="container-app">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--danger-color)" className="mr-2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span style={{ 
                color: 'var(--primary-color)', 
                fontWeight: 'bold',
                fontSize: '1.5rem'
              }}>
                COVID-19 World Data Explorer
              </span>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#" style={{ 
              color: 'var(--primary-color)', 
              fontWeight: '500',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(0, 120, 180, 0.1)',
            }}>
              Dashboard
            </a>
            <a href="#" style={{ 
              color: 'var(--neutral-color)', 
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} 
               onMouseOut={e => e.target.style.color = 'var(--neutral-color)'}>
              Statistics
            </a>
            <a href="#" style={{ 
              color: 'var(--neutral-color)', 
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} 
               onMouseOut={e => e.target.style.color = 'var(--neutral-color)'}>
              Maps
            </a>
            <a href="#" style={{ 
              color: 'var(--neutral-color)', 
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} 
               onMouseOut={e => e.target.style.color = 'var(--neutral-color)'}>
              About
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <a href="#" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Dashboard
            </a>
            <a href="#" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Statistics
            </a>
            <a href="#" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Maps
            </a>
            <a href="#" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              About
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;