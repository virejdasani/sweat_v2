import { Link } from 'react-router-dom';
import './home.css';
import Branding from '../Branding/Branding';

const Home = () => {
  return (
    <div className="home">
      <Branding />

      {/* top level selection of faculty, and department */}
      <div>
        {/* label */}
        <label htmlFor="faculty">Faculty:</label>

        {/* dropdown */}
        <select
          name="faculty"
          id="faculty"
          style={{
            width: '100px',
            height: '30px',
            marginBottom: '20px',
            marginLeft: '6px',
          }}
        >
          <option value="faculty1">EEE</option>
          <option value="faculty2">CS</option>
          <option value="faculty3">Some other faculty goes here</option>
        </select>
        <label htmlFor="department" style={{ marginLeft: '20px' }}>
          Department:
        </label>
        <select
          name="department"
          id="department"
          style={{
            width: '100px',
            height: '30px',
            marginBottom: '20px',
            marginLeft: '6px',
          }}
        >
          <option value="department1">EEE</option>
          <option value="department2">CS</option>
          <option value="department3">Some other department goes here</option>
        </select>
      </div>

      <h1>Home</h1>
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
