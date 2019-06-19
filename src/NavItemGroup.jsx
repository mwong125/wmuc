import React from 'react';
import styled from 'styled-components';
import * as CONSTANTS from './constants.jsx';

import NavItem from './NavItem.jsx';

const StyledNavItemGroup = styled.ul`
  margin-right: auto;
`;

function NavItemGroup() {
	let navItems = 
	  CONSTANTS.NAV_LINKS.map((link) =>
	  	<NavItem
	  	  key={link.href}
	  	  href={link.href}
	  	  label={link.label}
	  	  links={link.links}
	  	  component={link.component}
	  	/>
	  );
  return (
    <StyledNavItemGroup className="navbar-nav">
      {navItems}
    </StyledNavItemGroup>
  );
}

export default NavItemGroup;
