import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CTA = ({ icon, url }) => {
    return (
        <Link to={url}>
            {icon && <i className={`fa ${icon}`}></i>}
        </Link>
    );
};

export default CTA;