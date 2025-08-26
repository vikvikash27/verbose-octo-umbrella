
import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import AppDownloadBanner from '../AppDownloadBanner';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <AppDownloadBanner />
      <PublicFooter />
    </div>
  );
};

export default MainLayout;
