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
          width: '150px',
          height: '150px',
          position: 'absolute',
          bottom: '0',
          left: '22px',
        }}
      />
    </div>
  );
};

export default Branding;
