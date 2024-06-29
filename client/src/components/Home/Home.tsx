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
        <Link to="/academic-event-calendar">Academic Event Calendar</Link>
      </div>
      <div className="linkContainer">
        <Link to="/coursework-calendar">Coursework Calendar (for testing)</Link>
      </div>
      <div className="linkContainer">
        <Link to="/admin/create-module">Create Module</Link>
      </div>
      <div className="linkContainer">
        <Link to="/admin/programme-design">Programme Design</Link>
      </div>
      <div className="linkContainer">
        <Link to="/Graph">Graph</Link>
      </div>
    </div>
  );
};

export default Home;
