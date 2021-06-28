import React from 'react';
import './App.css';
import { UserHome } from './features/user/userHome';

function AdminApp() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <UserHome />
      </header>
    </div>
  );
}

export default AdminApp;
