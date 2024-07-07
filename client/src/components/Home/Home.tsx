import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>SWEAT Home</h1>
      <div className="linkContainer">
        <Link to="/student">Students go here</Link>
      </div>
      <div className="linkContainer">
        <Link to="/staff">Staff (passkey required)</Link>
      </div>
      <div className="linkContainer">
        <Link to="/admin/">Admin (passkey required)</Link>
      </div>
    </div>
  );
};

export default Home;
