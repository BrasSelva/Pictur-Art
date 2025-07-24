// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Footer.css'; // Tu peux styliser à ta façon

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/cgu">CGU</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-copy">
        © 2025 Pictur'Art par Pictur'Art
      </div>
    </footer>
  );
}

export default Footer;
