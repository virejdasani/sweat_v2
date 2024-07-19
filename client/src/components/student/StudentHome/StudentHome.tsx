import { Link } from 'react-router-dom';
import './StudentHome.css';
import Branding from '../../Branding/Branding';

const StudentHome = () => {
  return (
    <div className="home">
      <Branding />
      <h1>Student Home</h1>
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
        <Link to="/Graph">Workload Profiles</Link>
      </div>
    </div>
  );
};

export default StudentHome;
