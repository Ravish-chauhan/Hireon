import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-500">404</h1>
          <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
          <button className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
