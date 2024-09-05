import React from 'react';
import CTA from './CTA';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer>
      <CTA text="Click Me" icon="fa-arrow-right" />
      <p>© 2024 My Finance App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;