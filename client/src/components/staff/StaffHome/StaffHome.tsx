import { Link } from 'react-router-dom';
import './StaffHome.css';

const StaffHome = () => {
  return (
    <div className="home">
      <h1>SWEAT Staff Home</h1>

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

export default StaffHome;
