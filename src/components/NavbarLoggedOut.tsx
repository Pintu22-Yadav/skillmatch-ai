import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain } from 'lucide-react';

const NavbarLoggedOut: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/skills', label: 'Skills' },
    { path: '/jobs', label: 'Jobs' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
            <Brain size={28} />
            <span>SkillMatch AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium ${
                  isActive(link.path)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                } pb-1 transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-4 text-lg ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Links */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-4 text-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block py-2 px-4 text-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarLoggedOut;
