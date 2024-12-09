import React from 'react';
import './App.css';

const Navbar () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="/icon/logo32.png" alt="Chessed Logo" className="logo" />
        <h1 className="title">Chessed</h1>
      </div>
    </nav>
  );
};

export default Navbar;
