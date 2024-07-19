import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StaffHome.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Branding from '../../Branding/Branding';

const StaffHome = () => {
  const staffPassword = import.meta.env.VITE_STAFF_PASSWORD;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check local storage for staff login status on component mount
    const isStaff = localStorage.getItem('isStaff');
    if (isStaff === 'true') {
      toast.success('Welcome back staff!');
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const password = document.querySelector('input')?.value;
    if (password === staffPassword || password === adminPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('isStaff', 'true');
      toast.success('Welcome staff!');
    } else {
      toast.error('Incorrect password');
    }
  };

  return (
    <div className="home">
      <Branding />
      <h1 className="">Staff Home</h1>
      <button
        className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
        onClick={() => {
          window.history.back();
        }}
      >
        Home
      </button>
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
            <Link to="/Graph">Workload Profiles</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffHome;
