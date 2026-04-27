import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex flex-col flex-1">
        <Navbar />
        <main className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
