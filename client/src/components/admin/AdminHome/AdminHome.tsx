import { Link } from 'react-router-dom';
import './AdminHome.css';

const AdminHome = () => {
  return (
    <div className="home">
      <h1>SWEAT Admin Home</h1>

      {/* admin */}
      <div className="linkContainer">
        <Link to="/admin/set-key-dates">Set Key Dates (Admin access only)</Link>
      </div>
      {/* admin */}
      <div className="linkContainer">
        <Link to="/coursework-calendar">Coursework Calendar (for testing)</Link>
      </div>
      {/* admin */}
      <div className="linkContainer">
        <Link to="/admin/create-module">Create Module</Link>
      </div>
      {/* admin */}
      <div className="linkContainer">
        <Link to="/admin/programme-design">Programme Design</Link>
      </div>
      {/* staff */}
      <div className="linkContainer">
        <Link to="/academic-event-calendar">Academic Event Calendar</Link>
      </div>
      {/* student */}
      <div className="linkContainer">
        <Link to="/Graph">Graph</Link>
      </div>
    </div>
  );
};

export default AdminHome;
