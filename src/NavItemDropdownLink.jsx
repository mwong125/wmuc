import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  color: var(--color);
  display: block;
  width: 100%;
  padding: 0 1rem;

  &:hover, &:focus {
    color: var(--background-color);
    text-decoration: none;
    background-color: var(--color);
  }
`;


function NavItemDropdownLink(props) {
  return (
      <StyledLink to={props.href}>
        {props.label}
      </StyledLink>
  );
}

export default NavItemDropdownLink;