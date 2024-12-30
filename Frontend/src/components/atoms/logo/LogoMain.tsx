import logo from 'assets/logo/logo-VTC.png';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({ reverse, ...others }: { reverse?: boolean }) => {
  return <img src={logo} alt="VTC Telecom" className="w-60" />;
};

export default LogoMain;
