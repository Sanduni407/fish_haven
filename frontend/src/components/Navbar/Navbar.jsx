import React, { useState } from 'react'
import './Navbar.css'
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menu, setMenu] = useState("home");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className='premium-navbar'>
      <div className='premium-navbar-container'>
        <Link to='/' className='premium-navbar-logo'>
          <span className='premium-logo-text'>AquaExport</span>
        </Link>
        
        <ul className="premium-navbar-menu">
          <li className="premium-nav-item">
            <Link 
              to='/' 
              onClick={() => { setMenu("home"); scrollToSection(''); }}
              className={`premium-nav-link ${menu === "home" ? "premium-active" : ""}`}
            >
              <span className='premium-nav-text'>Home</span>
              <span className='premium-nav-underline'></span>
            </Link>
          </li>
          <li className="premium-nav-item">
            <a  
              href='#explore-menu' 
              onClick={() => { setMenu("Collection"); scrollToSection('explore-menu'); }}
              className={`premium-nav-link ${menu === "Collection" ? "premium-active" : ""}`}
            >
              <span className='premium-nav-text'>Fish Varieties</span>
              <span className='premium-nav-underline'></span>
            </a>
          </li>
          <li className="premium-nav-item">
            <a   
              href='#app-download' 
              onClick={() => { setMenu("aboutus"); scrollToSection('app-download'); }}
              className={`premium-nav-link ${menu === "aboutus" ? "premium-active" : ""}`}
            >
              <span className='premium-nav-text'>About Us</span>
              <span className='premium-nav-underline'></span>
            </a>
          </li>
          <li className="premium-nav-item">
            <a  
              href='#footer'  
              onClick={() => { setMenu("contact-us"); scrollToSection('footer'); }}
              className={`premium-nav-link ${menu === "contact-us" ? "premium-active" : ""}`}
            >
              <span className='premium-nav-text'>Contact Us</span>
              <span className='premium-nav-underline'></span>
            </a>
          </li>
          <li className="premium-nav-item">
            <Link 
              to='/exporter-register'  
              onClick={() => setMenu("exporter")}
              className={`premium-nav-link ${menu === "exporter" ? "premium-active" : ""}`}
            >
              <span className='premium-nav-text'>Register as Exporter</span>
              <span className='premium-nav-underline'></span>
            </Link>
          </li>
        </ul>
        
        <div className='premium-navbar-right'>
          <Link to='/login'>
            <button className='premium-signin-btn'>
              <span>Sign In</span>
              <svg className='premium-btn-icon' viewBox="0 0 24 24">
                <path fill="currentColor" d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar