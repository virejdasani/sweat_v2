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
            position: 'fixed',
            top: '10px',
            right: '10px',
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#0a0a94',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '15px',
            fontSize: '1.2rem',
            textAlign: 'center',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
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

        <select
          name="department"
          id="department"
          style={{
            width: '220px',
            height: '30px',
            marginBottom: '20px',
            marginLeft: '6px',
            position: 'absolute',
            top: '220px',
            left: '20px',
          }}
        >
          <option value="department1">EEE</option>
          <option value="department2">CS</option>
          <option value="department2">Other</option>
        </select>
      </div>

      <div className="buttonContainer">
        <div className="">
          Student
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
              src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/student.png"
              alt="Student"
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
          </Link>
        </div>
        <div className="">
          Staff
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
              src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/staff.png"
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
          Admin
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
              src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/admin.png"
              alt="Student"
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
          </Link>
        </div>
      </div>
      <div 
        style={{
          position: 'fixed' as 'fixed',
          bottom: '10px',
          right: '10px',
          backgroundColor: '#ff0000',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '14px',
          fontWeight: 'bold' as 'bold',
          zIndex: '1000',
        }}
      >
        BETA
      </div>
    </div>
  );
};

export default Home;
