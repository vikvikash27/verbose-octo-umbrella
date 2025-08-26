
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

// A simple 404 page for handling routes that don't exist.
const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50">
      <h1 className="text-6xl font-bold text-brand-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-800">Page Not Found</h2>
      <p className="mt-2 text-slate-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-6">
        <Button>Go to Home Page</Button>
      </Link>
    </div>
  );
};

export default NotFound;
