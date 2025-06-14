import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar flex-space">
      <div className="logo-flex">
        <img src="/images/final_logo.png" width="200px" alt="logo" />
      </div>

      <div className="menu" onClick={() => setIsOpen(!isOpen)}>
        &#9776; {/* hamburger icon */}
      </div>

      <ul className={`flex ${isOpen ? 'show' : ''}`}>
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li>
          <Link to="/admin">ADMIN</Link>
        </li>
        <li>
          <Link to="/student">STUDENT</Link>
        </li>
        <li>
          <Link to="/team">TEAM</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
