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
          top: '0px',
          left: 'calc(50% - 65px)',
        }}
      />
      <img
        src={uniLogo}
        alt="University Logo"
        className="uniLogo"
        style={{
          width: '325px',
          height: '165px',
          position: 'absolute',
          top: '-25px',
          left: '-3px',
        }}
      />
    </div>
  );
};

export default Branding;
