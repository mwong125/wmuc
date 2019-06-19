import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import NavItemGroup from './NavItemGroup.jsx';

import * as CONSTANTS from './constants.jsx';
import { withRouter } from 'react-router-dom';

const StyledNav = styled.nav`
  text-transform: uppercase;
  font-weight: lighter;
  border-bottom: 1px solid var(--color);
`;

const StyledLink = styled(Link)`
  font-weight: bold;
  margin: 0 1rem 0 0;

  &:hover, &:focus {
  	text-decoration: none;
  }
`;

const AuthButton = withRouter(({ history }) => (
  CONSTANTS.FAKE_AUTH.isAuthenticated ? (
      <button className="btn btn-sm btn-outline-light" onClick={() => {
        CONSTANTS.FAKE_AUTH.signout(() => history.push('/'))
      }}>Sign out</button>
  ) : (
    <div>You are not logged in.</div>
  )
));

function Nav() {
  return (
    <StyledNav className="navbar navbar-expand-lg">
      <StyledLink to="/">
          WMUC
      </StyledLink>
      <NavItemGroup />
      <AuthButton />
    </StyledNav>
  );
}

export default Nav;
