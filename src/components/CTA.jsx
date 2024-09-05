import React from 'react';
import { Link } from 'react-router-dom';

const CTA = ({ icon, url }) => {
    return (
        <Link to={url}>
            {icon && <span className="icon">{icon}</span>}
        </Link>
    );
};

export default CTA;