import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page" id="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <p className="not-found-text">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard" className="btn btn-primary" id="go-home-btn">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
