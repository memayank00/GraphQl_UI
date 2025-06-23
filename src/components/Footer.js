import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div>
        &copy; {new Date().getFullYear()} OTT Platform Demo &mdash; All rights reserved.
      </div>
      <div>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
          GitHub
        </a>
        <span className="footer-sep">|</span>
        <a href="mailto:support@example.com" className="footer-link">
          Contact Support
        </a>
      </div>
    </footer>
  );
}
