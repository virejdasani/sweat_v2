import { Link } from 'react-router-dom';
import './home.css';

import './branding.css';
import logo from '../Branding/logo.png';
import uniLogo from '../Branding/uniLogo.png';

const Home = () => {
  return (
    <div className="home">
      <div className="branding-container">
        <img src={uniLogo} alt="University Logo" className="uniLogo" />
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="linkContainer about">
        <Link
          to="/about"
          style={
            {
              // position: 'fixed',
              // top: '10px',
              // right: '10px',
              // display: 'inline-block',
              // padding: '10px 20px',
              // backgroundColor: '#0a0a94',
              // color: 'white',
              // textDecoration: 'none',
              // borderRadius: '15px',
              // fontSize: '1.2rem',
              // textAlign: 'center',
              // transition: 'background-color 0.3s ease',
              // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }
          }
        >
          About
        </Link>
      </div>
      <div className="buttonContainer">
        <div className="button">
          <Link to="/student">
            <img
              className="buttonImage"
              src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/student.png"
              alt="Student"
            />
            <p
              style={{
                color: 'white',
                fontSize: '1.5rem',
                textAlign: 'center',
                marginTop: '5px',
              }}
            >
              Student
            </p>
          </Link>
        </div>
        <div className="button">
          <Link to="/staff">
            <img
              className="buttonImage"
              src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/staff.png"
              alt="Staff"
            />
            <p
              style={{
                color: 'white',
                fontSize: '1.5rem',
                textAlign: 'center',
                marginTop: '5px',
              }}
            >
              Staff
            </p>
          </Link>
        </div>
        <div className="button">
          <Link to="/admin">
            <img
              className="buttonImage"
              src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/admin.png"
              alt="Admin"
            />
            <p
              style={{
                color: 'white',
                fontSize: '1.5rem',
                textAlign: 'center',
                marginTop: '5px',
              }}
            >
              Admin
            </p>
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
