import { Link } from 'react-router-dom';
import './StudentHome.css';

const StudentHome = () => {
  return (
    <div className="home">
      <h1>SWEAT Student Home</h1>

      {/* student */}
      <div className="linkContainer">
        <Link to="/Graph">Graph</Link>
      </div>
    </div>
  );
};

export default StudentHome;
