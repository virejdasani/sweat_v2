import { Link } from 'react-router-dom';
import './home.css';
import Branding from '../Branding/Branding';

const Home = () => {
  return (
    <div className="home">
      <Branding />

      {/* small about icon top right opens About/ page component */}
      {/* <button className="aboutButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"> */}
      <div className="linkContainer">
        <Link
          to="/about"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            margin: '10px',
            textDecoration: 'none',
            backgroundColor: '#333',
            padding: '5px',
            fontSize: '1.2em',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
        >
          About
        </Link>
      </div>
      {/* </button> */}

      <div>
        {/* <label htmlFor="faculty">Faculty:</label>
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
          <option value="faculty1">CS</option>
          <option value="faculty2">EEE</option>
          <option value="faculty3">Some other faculty goes here</option>
        </select> */}
        {/* <label htmlFor="department" style={{ marginLeft: '20px' }}>
          Department:
        </label> */}
        <select
          name="department"
          id="department"
          style={{
            width: '220px',
            height: '30px',
            marginBottom: '20px',
            marginLeft: '6px',
            position: 'absolute',
            top: '180px',
            left: '20px',
          }}
        >
          <option value="department1">Science & Engineering</option>
          <option value="department2">Other</option>
        </select>
      </div>

      <div className="buttonContainer">
        <div className="">
          <Link
            className="button"
            to="/student"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: 'white',
            }}
          >
            <img
              className="buttonImage"
              src="https://via.placeholder.com/150"
              alt="Student"
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
          </Link>
        </div>
        <div className="">
          <Link
            className="button"
            to="/staff"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: 'white',
            }}
          >
            <img
              className="buttonImage"
              src="https://via.placeholder.com/150"
              alt="staff"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
              }}
            />
          </Link>
        </div>
        <div className="">
          <Link
            className="button"
            to="/admin"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: 'white',
            }}
          >
            <img
              className="buttonImage"
              src="https://via.placeholder.com/150"
              alt="Student"
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
