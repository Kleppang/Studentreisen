import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

import '../CSS/Navbar.css';
import favicon from '../../assets/usn.png';
import CookieService from '../Services/CookieService';

function Navbar(props) {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [loading, setLoading] = useState(true);
    // Props som mottas fra App, viser til om bruker er inn-/utlogget
    const [auth, setAuth] = useState(false);
    const [type, setType] = useState(null);
    const [notif, setNotif] = useState(null);
 
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    let history = useHistory()

    // Testing på om en "LOGG UT"-knapp skal vises i navbar eller i meny
    const showButton = () => {
      if (!loading) {
        if(window.innerWidth < 1280) {
            setButton(false);
            if (auth) {
              try {
                document.getElementById("loggBtnMobil").style.visibility = "visible";
              } catch (TypeError) {}

            }
        } else {
            setButton(true);
            if (auth) {
              try {
                document.getElementById("loggBtnMobil").style.visibility = "collapse";
            } catch (TypeError) {}
            }
        }
      }
    };

    useEffect( () => {
      setAuth(props.auth);
      setType(props.type);
      setNotif(props.notif);
      showButton();
      setLoading(false);
    }, [props]); 

    // Legger til eller fjerner padding under navbar, for å skyve innholdet under nedover. //
    const expand = () => document.getElementById("bar").style.paddingBottom = "60vh";
    const shrink = () => document.getElementById("bar").style.paddingBottom = "0vh";

    // Lytt etter resizing og juster deretter
    window.addEventListener('resize', closeMobileMenu);
    window.addEventListener('resize', shrink);
    window.addEventListener('resize', showButton);

    // Styling av Material UI-elementer
    const useStyles = makeStyles({
      navbtn: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        height: '100%'
      },

      loggbtn: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'grid',
        minWidth: '7rem',
        transform: 'translate(45vw)'
      },

      loggbtnNoAuth: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'grid',
        minWidth: '7rem',
        transform: 'translate(30vw)',
        textDecoration: 'none'
      },

      loggbtnmobil: {
        color: '#fff',
        fontSize: '1.5rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        height: '100%',
        visibility: 'collapse'
      }
    });
    const classes = useStyles();

    const loggUt = () => {
      shrink();
      closeMobileMenu();
      CookieService.remove("authtoken");
      setAuth(false);
      history.push("/")
    }

    const onLink = () => {
      closeMobileMenu()
      shrink()
    }

    const visNotif = () => {
      console.log("Vis notifikasjoner");
    }

    if(loading) {
      return(
        null
      );
    }

    if (!loading) return (
        <>
          <nav className='navbar' id="bar" >
            <div className='navbar-container'>
              <Link 
                to="/" 
                className="navbar-logo" 
                onClick={closeMobileMenu}>
                <img className="navbar-logo-png" src={favicon} alt="USN" />
              </Link>
              {/* Første av en serie tester i 'navbar-container' på om bruker er innlogget */}
              {auth && 
              <div className='menu-icon' onClick={handleClick}>
                <i className={click? 'fas fa-times' : 'fas fa-bars'} 
                  onClick={click? shrink : expand}>
                </i>
              </div>
              }
              
              {auth && <div className={click ? 'nav-menu active' : 'nav-menu'}>
                <Button
                  className={classes.loggbtnmobil}
                  onClick={loggUt}
                  id='loggBtnMobil'>
                  Logg ut
                </Button>

                <Button 
                  className={classes.navbtn} 
                  onClick={onLink}
                  component={Link} 
                  to='/course'>
                  Kurs
                </Button>

                <Button 
                  className={classes.navbtn}
                  onClick={onLink}
                  component={Link}
                  to='/seminar'
                >
                Seminarer
                </Button>
    
                <Button
                  className={classes.navbtn}
                  onClick={onLink}
                  component={Link}
                  to='/CV'
                >
                  CV
                </Button>
                {type >= 2 && 
                  <Button 
                    className={classes.navbtn}
                    onClick={onLink}
                    component={Link} 
                    to='/Tools' >
                      Verktøy
                  </Button>
                }
              </div> }

              {auth && notif != null && 
                <NotificationImportantIcon id="notif-bell" onClick={visNotif} />
              }
              {auth && notif == null &&
                <NotificationsNoneIcon id="notif-bell" onClick={visNotif} />
              }
              
              {auth && <Link
                to='/Profile'>
                <i className="far fa-user" />
              </Link> }
              {button && auth && <Button onClick={loggUt} className={classes.loggbtn} > LOGG UT </Button> }
              {button && !auth && <Link to='/Register' className={classes.loggbtnNoAuth} > REGISTRER </Link> }
              {!auth && <Link to='/Login' className={classes.loggbtnNoAuth} > LOGG INN </Link> }
            </div>
          </nav>
        </>
      );
    }

export default Navbar;