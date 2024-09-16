import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-page cc-active w-inline-block">
          <div>Home</div>
        </Link>
        <Link to="/dashboard" className="navbar-page w-inline-block">
          <div>Dashboard</div>
        </Link>
        <a href="#" className="navbar-page analytics w-inline-block">
          <div>
            Analytics <span className="coming-soon"> coming soon</span>
          </div>
        </a>
        <a href="https://www.basedkeren.com/" className="navbar-page w-inline-block">
          <div>Keren Website</div>
        </a>
        <a href="#" className="navbar-menu w-inline-block" onClick={toggleMenu}>
          <div className="menu-icon">
            <img src="images/open.svg" loading="lazy" alt="" className="c-icon" />
          </div>
        </a>
      </div>

      <div className={`navbar-btm ${isMenuOpen ? 'active' : ''}`}>
        <a href="https://t.me/kerenbase" className="navbar-extpage w-inline-block">
          <div>Telegram</div>
          <div className="icon-16">
            <img src="images/ext-link.svg" loading="lazy" alt="" className="c-icon" />
          </div>
        </a>
        <a href="https://dexscreener.com/base/0x1ca25a133160beb02b18c1983c997fafbe98bc6e" className="navbar-extpage w-inline-block">
          <div>Chart</div>
          <div className="icon-16">
            <img src="images/ext-link.svg" loading="lazy" alt="" className="c-icon" />
          </div>
        </a>
        <a href="https://warpcast.com/basedkeren" className="navbar-extpage w-inline-block">
          <div>Warpcast</div>
          <div className="icon-16">
            <img src="images/ext-link.svg" loading="lazy" alt="" className="c-icon" />
          </div>
        </a>
        <a href="https://www.dextools.io/app/en/base/pair-explorer/0x1ca25a133160beb02b18c1983c997fafbe98bc6e?t=1715622444271" className="navbar-extpage w-inline-block">
          <div>Video tutorial</div>
          <div className="icon-16">
            <img src="images/ext-link.svg" loading="lazy" alt="" className="c-icon" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
