import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>SWEAT Home</h1>
      <div className="linkContainer">
        <Link to="/admin/set-key-dates">Set Key Dates (Admin access only)</Link>
      </div>
      <div className="linkContainer">
        <Link to="/coursework-calendar">Coursework Calendar</Link>
      </div>
    </div>
  );
};

export default Home;
