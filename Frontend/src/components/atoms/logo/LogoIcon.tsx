/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 *
 */

import logo from 'assets/logo/logo-VTC.png';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  return <img src={logo} alt="VTC Telecom" className="w-full" />;
};

export default LogoIcon;
