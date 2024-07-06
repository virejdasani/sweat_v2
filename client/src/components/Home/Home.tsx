import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>SWEAT Home</h1>

      <div className="linkContainer">
        <Link to="/admin/">Admin (passkey required (NOT ADDED YET))</Link>
      </div>
      <div className="linkContainer">
        <Link to="/staff">Staff (passkey required (NOT ADDED YET))</Link>
      </div>
      <div className="linkContainer">
        <Link to="/student">Student</Link>
      </div>
    </div>
  );
};

export default Home;
