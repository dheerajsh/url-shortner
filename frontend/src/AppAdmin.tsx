import React from 'react';
import './App.css';
import { AdminHome } from './features/admin/AdminHome';

function AdminApp() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <AdminHome />
      </header>
    </div>
  );
}

export default AdminApp;
