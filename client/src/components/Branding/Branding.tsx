import logo from './logo.png';
import uniLogo from './UOL-Logo.png';

const Branding = () => {
  return (
    <div
      style={{
        marginTop: '-150px',
      }}
    >
      <img
        src={logo}
        alt="Logo"
        className="logo"
        style={{
          width: '150px',
          height: '150px',
          position: 'absolute',
          top: '0px',
          left: 'calc(50% - 65px)',
        }}
      />
      <img
        src={uniLogo}
        alt="University Logo"
        className="uniLogo"
        style={{
          width: '300px',
          height: '80px',
          position: 'absolute',
          top: '25px',
          left: '10px',
        }}
      />
    </div>
  );
};

export default Branding;
