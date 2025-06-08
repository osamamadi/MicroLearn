// app/Components/ComponentsLayout/LayoutHeader.js
'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

export default function LayoutHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        !e.target.closest('.mobile-menu') &&
        !e.target.closest('.menu-button')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Toggle mobile menu
  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent immediate closing
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      {isMenuOpen && <MobileMenu setIsMenuOpen={setIsMenuOpen} />}
    </header>
  );
}
