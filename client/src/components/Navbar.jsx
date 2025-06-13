import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar flex-space">
      <div className="logo-flex">
        <img src="/images/final_logo.png" width="200px" alt="logo" />
      </div>
      <ul className="flex">
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li>
          <Link to="/admin">ADMIN</Link>
        </li>
        {/* <li>
          <Link to="/faculty">FACULTY</Link>
        </li> */}
        <li>
          <Link to="/student">STUDENT</Link>
        </li>
        {/* <li>
          <Link to="/contact">CONTACT US</Link>
        </li> */}
        <li>
          <Link to="/team">TEAM</Link>
        </li>
      </ul>
      <div className="menu">
        <i className="ri-menu-line"></i>
      </div>
    </nav>
  );
};

export default Navbar;
