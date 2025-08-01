import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  onCartClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onCartClick }) => {
  return (
    <div className="flex flex-col min-h-screen bg-emerald-50 text-gray-800">
      <Header onCartClick={onCartClick} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
