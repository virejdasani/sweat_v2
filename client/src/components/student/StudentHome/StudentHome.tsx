import { Link } from 'react-router-dom';
import './StudentHome.css';

const StudentHome = () => {
  return (
    <div className="home">
      <h1>SWEAT Student Home</h1>
      <button
        className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
        onClick={() => {
          window.history.back();
        }}
      >
        Home
      </button>
      {/* student */}
      <div className="linkContainer">
        <Link to="/Graph">Graph</Link>
      </div>
    </div>
  );
};

export default StudentHome;
