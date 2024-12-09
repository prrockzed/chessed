import React from 'react';
import './App.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="logo.png" alt="Chessed Logo" className="logo" />
        <h1 className="title">Chessed</h1>
      </div>
    </nav>
  );
};

export default Navbar;
