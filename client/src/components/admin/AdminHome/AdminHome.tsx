import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminHome.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const password = document.querySelector('input')?.value;
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
      <h1 className="">SWEAT Admin Home</h1>

      {!isLoggedIn ? (
        <div className="linkContainer">
          <form action="submit">
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
        <>
          <div className="linkContainer">
            <Link to="/admin/set-key-dates">
              Set Key Dates (Admin access only)
            </Link>
          </div>
          <div className="linkContainer">
            <Link to="/coursework-calendar">
              Coursework Calendar (for testing)
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
            <Link to="/Graph">Graph</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHome;
