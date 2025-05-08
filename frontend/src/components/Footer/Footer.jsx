import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <div className="footer-logo-container">
                    <img src={assets.logo} alt="Fish-Haven Logo" className='footer-logo-img' />
                    <span className='footer-logo-text'>Fish-Haven</span>
                </div>
                <p>Our fish are vibrant, healthy, and carefully bred to bring color and life to any aquarium</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="Facebook" />
                    <img src={assets.twitter_icon} alt="Twitter" />
                    <img src={assets.linkedin_icon} alt="LinkedIn" />
                </div>
            </div>
            <div className="footer-content-right">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Fish Collection</li>
                </ul>
            </div>
            <div className="footer-content-center">
               <h2>GET IN TOUCH</h2>
               <ul>
                <li>+94 23 43 234</li>
                <li>contact@fishhaven.com</li>
               </ul>
            </div>
        </div>
        <hr/>
        <p className="footer-copyright">Copyright 2024 fishhaven.com - All Right Reserved</p>
    </div>
  );
};

export default Footer;