import React from 'react';
import { Link } from 'react-router-dom';
import './ListItem.css';

const ListItem = ({ link, title, subTitle, status, statusColor }) => {
  return (
    <li className="list-item">
      <div className="list-item-content">
        <Link to={link} className="list-item-title">
          {title}
        </Link>
        {subTitle && <small className="list-item-subtitle">{subTitle}</small>}
      </div>
      <span className="list-item-status" style={{ backgroundColor: statusColor }}>
        {status}
      </span>
    </li>
  );
};

export default ListItem;
