import React from 'react';
import CTA from './CTA';
import { FaCoffee } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
    <CTA text="Click Me" icon={<FaCoffee />} />
      <p>© 2024 My Finance App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
