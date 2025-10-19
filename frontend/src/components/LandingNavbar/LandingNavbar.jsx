import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react';

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-blue-600 shadow-lg py-2' : 'bg-blue-600 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-xl sm:text-2xl font-bold text-white flex-shrink-0">
            Startup Studio
          </h1>

          {/* Desktop Menu - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="/" className="text-white hover:text-blue-200 transition-colors duration-300 font-medium whitespace-nowrap">
              Home
            </a>
            <a href="/mentors" className="text-white hover:text-blue-200 transition-colors duration-300 font-medium whitespace-nowrap">
              Mentors
            </a>
            <a href="/startups" className="text-white hover:text-blue-200 transition-colors duration-300 font-medium whitespace-nowrap">
              Startups
            </a>
            <a href="/cohort-registration" className="bg-white text-blue-600 px-4 xl:px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap">
              Join the Cohort
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:bg-blue-700 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-3">
            <a 
              href="/" 
              className="block text-white hover:text-blue-200 hover:bg-blue-700 transition-all px-4 py-2 rounded-lg"
              onClick={handleLinkClick}
            >
              Home
            </a>
            <a 
              href="/mentors" 
              className="block text-white hover:text-blue-200 hover:bg-blue-700 transition-all px-4 py-2 rounded-lg"
              onClick={handleLinkClick}
            >
              Mentors
            </a>
            <a 
              href="/startups" 
              className="block text-white hover:text-blue-200 hover:bg-blue-700 transition-all px-4 py-2 rounded-lg"
              onClick={handleLinkClick}
            >
              Startups
            </a>
            <a 
              href="/cohort-registration" 
              className="block text-center bg-white text-blue-600 px-6 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md mx-4 mt-4"
              onClick={handleLinkClick}
            >
              Join the Cohort
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;