import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../Branding/logo.png';
import uniLogo from '../../Branding/uniLogo.png';
import './AdminHome.css';

const AdminHome = () => {
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check local storage for admin login status on component mount
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
      toast.success('Welcome back admin!');
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const password = document.querySelector<HTMLInputElement>('input')?.value;
    if (password === adminPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('isAdmin', 'true');
      toast.success('Welcome admin!');
    } else {
      toast.error('Incorrect password');
    }
  };

  return (
    <div className="home">
      <img
        src={logo}
        alt="Logo"
        className="logo"
        style={{
          width: '150px',
          height: '150px',
          position: 'absolute',
          bottom: '0',
          right: '0',
        }}
      />
      <img
        src={uniLogo}
        alt="University Logo"
        className="uniLogo"
        style={{
          width: '190px',
          position: 'absolute',
          bottom: '0',
          left: '22px',
        }}
      />
      <h1 className="">Admin Home</h1>
      <button
        className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
        style={{
          position: 'absolute', 
           top: '10px', 
           left: '10px',
           padding: '10px 20px',
           backgroundColor: '#0a0a94',
           color: 'white',
           textDecoration: 'none',
           borderRadius: '15px',
           fontSize: '1.2rem',
           textAlign: 'center',
           transition: 'background-color 0.3s ease',
           boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        onClick={() => {
          window.location.href = '/';
        }}
      >
        Home
      </button>
      {!isLoggedIn ? (
        <div className="linkContainer">
          <form>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              className="px-2 py-2"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary mx-2 px-2 py-2"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div
          className="makeResponsiveScrollable"
          style={{
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div className="linkContainer mt-50">
            <Link to="/admin/set-key-dates">
              Set Key Dates
            </Link>
          </div>
          <div className="linkContainer">
            <Link to="/admin/create-module">Create Module</Link>
          </div>
          <div className="linkContainer">
            <Link to="/admin/programme-design">Programme Design</Link>
          </div>
          <div className="linkContainer">
            <Link to="/academic-event-calendar">Academic Event Calendar</Link>
          </div>
          <div className="linkContainer">
            <Link to="/student">Workload Profiles</Link>
          </div>
          <div className="linkContainer">
            <Link to="/admin/settings">Settings</Link>
          </div>
        </div>
      )}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: '#ff0000',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: '1000',
      }}>
        BETA
      </div>
    </div>
  );
};

export default AdminHome;
