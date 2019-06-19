import React from 'react';
import styled from 'styled-components';

const StyledDropdown = styled.div`
  background: var(--background-color);
  border-color: var(--color);
  display: block;
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
`;

function Dropdown(props) {
  return (
    <StyledDropdown className={"dropdown-menu dropdown-menu-" + props.align} isVisible={props.isVisible}>
      {props.children}
    </StyledDropdown>
  );
}

export default Dropdown;