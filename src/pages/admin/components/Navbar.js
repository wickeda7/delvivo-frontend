import React from 'react';
import styled from 'styled-components';

import { FaUserMinus } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../context/user_context';
const Navbar = () => {
  const { logout } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'activelink' : '';
  };
  return (
    <NavContainer>
      <div className='nav-center'>
        <div className='nav-header'>
          <NavLink to='/'>
            <img src='/logo2.jpg' alt='Delvico' />
          </NavLink>
        </div>
        <ul className='nav-links'>
          <li>
            <NavLink to='/admin' className={getNavLinkClass('/admin')}>
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/admin/drivers'
              className={getNavLinkClass('/admin/drivers')}
            >
              Drivers
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/admin/settings'
              className={getNavLinkClass('/admin/settings')}
            >
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/admin/synch'
              className={getNavLinkClass('/admin/synch')}
            >
              Synch Data
            </NavLink>
          </li>
        </ul>
        <div>
          <button
            type='button'
            className='auth-btn'
            onClick={() => {
              handleLogout();
            }}
          >
            Logout <FaUserMinus />
          </button>
        </div>
      </div>
    </NavContainer>
  );
};
const NavContainer = styled.nav`
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .nav-center {
    width: 90vw;
    margin: 0 auto;
    max-width: var(--max-width);
  }
  .activelink {
    border-bottom: 2px solid var(--clr-primary-7);
  }
  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 175px;
      margin-left: -15px;
    }
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }

  .nav-links {
    display: none;
  }

  @media (min-width: 992px) {
    .nav-center {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
    }
    .nav-links {
      display: flex;
      justify-content: center;
      li {
        margin: 0 0.5rem;
      }
      a {
        color: var(--clr-grey-3);
        font-size: 1rem;
        text-transform: capitalize;
        letter-spacing: var(--spacing);
        padding: 0.5rem;
        &:hover {
          border-bottom: 2px solid var(--clr-primary-7);
        }
      }
    }
  }
`;
export default Navbar;
