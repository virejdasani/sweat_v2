import { Link } from 'react-router-dom';
import './home.css';
import Branding from '../Branding/Branding';
import Footer from './Footer';
import Header from './Header';


const Home = () => {
  return (
    <div className="home">
      <Branding />
      <Header />

      {/* small about icon top right opens About/ page component */}
      {/* <button className="aboutButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"> */}
      <div className="linkContainer">
        <Link
          to="/about"
          className="aboutButton"
          style={{
            position: 'fixed',
            top: '25px',
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

      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25px',
        gap: '100px',
      }}>
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
          name="department1"
          id="department2"
          style={{
            width: '220px',
            height: '30px',
            marginRight: '10px',   
            border: '2px solid black',
            borderRadius: '4px',        
          }}
        >
          <option value="department1">Science & Engineering</option>
          <option value="department2">Other</option>
        </select>

        <select
          name="department2"
          id="department2"
          style={{
            width: '220px',
            height: '30px',
            border: '2px solid black',
            borderRadius: '4px',
          }}
        >
          <option value="department1">EEE</option>
          <option value="department2">CS</option>
          <option value="department2">Other</option>
        </select>
      </div>

      {/* New Portal Styles -- WORK IN PROGRESS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: '-75px',
        marginTop: '20px',
        padding: '20px',
        gap: '50px',
      }}
      >

        {/* Student Portal */}
        <Link
        to="/student"
        style={{
          textDecoration: 'none',
          color: 'black',
        }}
        >
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '15px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <img 
          src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/student.png" 
          alt="Student"
          style={{ width: '80%', borderRadius: '10px' }} 
          />
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Student Portal</p>
          </div>
        </Link>

        {/* Staff Portal */}
        <Link
          to="/staff"
          style={{
            textDecoration: 'none',
            color: 'black'
          }}
        >
          <div 
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '15px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0 , 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            textAlign: 'center'
          }}
        >
          <img 
          src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/staff.png" 
          alt="Staff"
          style={{ width: '80%', borderRadius: '10px'}}
          />
          <p style={{ marginTop: '10px', fontWeight: 'bold'}}>Staff Portal</p>
          </div>
        </Link>

        {/* Admin Portal */} 
        <Link
          to="/admin"
          style={{
            textDecoration: 'none',
            color: 'black',
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '15px',
              backgroundColor: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            <img 
              src="https://raw.githubusercontent.com/virejdasani/sweat_v2/master/client/src/components/Home/admin.png" 
              alt="Admin"
              style={{ width: '80%', borderRadius: '10px' }} 
            />
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* OLD PORTAL DESIGN - DISCONTINUED */}
      {/* <div className="buttonContainer">
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
              alt="Admin"
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
          </Link>
        </div>
      </div> */}
      <Footer />
    </div>
  );
};

export default Home;
