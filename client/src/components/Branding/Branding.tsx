import logo from './logo.png';
import uniLogo from './uniLogo.png';

const Branding = () => {
  return (
    <div>
      <img
        src={logo}
        alt="Logo"
        className="logo"
        style={{
          width: '100px',
          height: '100px',
          position: 'absolute',
          bottom: '0',
          right: '0',
        }}
      />
      <img
        src={uniLogo}
        alt="University Logo"
        className="uniLogo"
        style={{
          width: '190px',
          position: 'absolute',
          bottom: '0',
          left: '22px',
        }}
      />
    </div>
  );
};

export default Branding;
