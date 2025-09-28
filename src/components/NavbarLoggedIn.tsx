import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain, User, Bell, LogOut } from 'lucide-react';

const NavbarLoggedIn: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/skills', label: 'Skills' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/profile', label: 'Profile' }
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
            
            {/* User Menu */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              <button className="p-2 text-gray-600 hover:text-blue-600 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">John Doe</span>
              </div>
              <button className="text-gray-600 hover:text-red-600 transition-colors">
                <LogOut size={20} />
              </button>
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
            
            {/* Mobile User Menu */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-600">Software Developer</div>
                </div>
              </div>
              <button className="w-full text-left py-2 px-4 text-lg text-red-600 hover:bg-red-50 transition-colors duration-200">
                <LogOut size={20} className="inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarLoggedIn;
