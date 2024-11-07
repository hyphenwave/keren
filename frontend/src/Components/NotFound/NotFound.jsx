import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="content">
      <div className="page-header">
        <h2>Page Not Found</h2>
      </div>
      <div className="c-complaint_intro">
        Sorry, the complaint box you're looking for doesn't exist.
        <br /><br />
        <Link to="/" className="btn">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;