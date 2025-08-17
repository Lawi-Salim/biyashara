import React from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
