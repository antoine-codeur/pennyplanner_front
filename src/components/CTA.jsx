// src/components/CTA.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CTA = ({ icon, url, text }) => {
    return (
        <Link to={url} className="cta">
            {icon && <i className={`fa ${icon}`}></i>}
            {text && <span>{text}</span>}
        </Link>
    );
};

export default CTA;
