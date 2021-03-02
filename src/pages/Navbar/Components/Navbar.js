import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Navbar.css';
import favicon from '../../../assets/usn.png';
import { Button } from '../../../global/Components/Button';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect( () => {
      showButton();
    }, []); 

    window.addEventListener('resize', showButton);
    
    return (
        <>
          <nav className='navbar'>
            <div className='navbar-container'>
              <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                <img className="navbar-logo-png" src={favicon} alt="USN" />
              </Link>
              <div className='menu-icon' onClick={handleClick}>
                <i className={click? 'fas fa-times' : 'fas fa-bars'} />
              </div>
              
              <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                <li className='nav-item'>
                  <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                    Hjem
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    to='/'
                    className='nav-links'
                    onClick={closeMobileMenu}
                  >
                    Kurs
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    to='/'
                    className='nav-links'
                    onClick={closeMobileMenu}
                  >
                    Seminarer
                  </Link>
                </li>
    
                <li>
                  <Link
                    to='/'
                    className='nav-links'
                    onClick={closeMobileMenu}
                  >
                    CV
                  </Link>
                </li>

                <li>
                  <Link
                    to='/sign-up'
                    className='nav-links-mobile'
                    onClick={closeMobileMenu}
                  >
                    Logg ut
                  </Link>
                </li>
              </ul>
              <Link
                to="/"
                onClick={closeMobileMenu}
              >
                <i className="far fa-user" />
              </Link>
              {button && <Button buttonStyle='btn--outline'>LOGG UT</Button>}

            </div> 
          </nav>
        </>
      );
    }

export default Navbar
