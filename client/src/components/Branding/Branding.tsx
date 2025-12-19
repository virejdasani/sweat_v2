import logo from './logo.png';
import uniLogo from './UOL-Logo.png';

const Branding = () => {
  return (
    <div>
      <img
        src={logo}
        alt="Logo"
        className="logo"
        style={{
          width: '150px',
          height: '150px',
          position: 'absolute',
          top: '20px',
          left: 'calc(50% - 65px)',
        }}
      />
      <img
        src={uniLogo}
        alt="University Logo"
        className="uniLogo"
        style={{
          width: '394px',
          height: '130px',
          position: 'absolute',
          top: '25px',
          left: '10px',
        }}
      />
    </div>
  );
};

export default Branding;
