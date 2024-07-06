import { useState } from 'react';
import { Link } from 'react-router-dom';
import './StaffHome.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffHome = () => {
  const staffPassword = import.meta.env.VITE_STAFF_PASSWORD;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const password = document.querySelector('input')?.value;
    if (password === staffPassword) {
      setIsLoggedIn(true);
      toast.success('Welcome staff!');
    } else {
      toast.error('Incorrect password');
    }
  };

  return (
    <div className="home">
      <h1 className="">SWEAT Staff Home</h1>

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

export default StaffHome;
