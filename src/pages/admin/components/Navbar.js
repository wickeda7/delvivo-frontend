import React from 'react';
import styled from 'styled-components';

import { FaUserMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../../context/user_context';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const { logout } = useUserContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavContainer>
      <div className='nav-center'>
        <div className='nav-header'>
          <Link to='/'>
            <img src='/logo2.jpg' alt='Delvico' />
          </Link>
        </div>
        <ul className='nav-links'>
          <li>
            <Link to='/admin'>Orders</Link>
          </li>
          <li>
            <Link to='/admin/drivers'>Drivers</Link>
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
