import React from 'react';
import { Link } from 'react-router-dom';

const LinkButton = ({ text, icon, url }) => {
    return (
        <Link to={url}>
            {text}
            {icon && <span className="icon">{icon}</span>}
        </Link>
    );
};

export default LinkButton;