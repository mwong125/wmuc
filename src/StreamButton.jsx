import React from 'react';
import styled from 'styled-components';
import * as CONSTANTS from './constants.jsx';

import Icon from './Icon.jsx';

const StyledStreamButton = styled.a`
  display: block;

  &, &:hover {
    color: var(${props => props.isOn ? '--on' : '--off'});
    text-decoration: none;
  }

  & i {
    padding-left: .1rem;
  }

  @media (min-width: 576px) {
    display: inline;
  }
`;

function StreamButton(props) {
  return (
    <StyledStreamButton
      isOn={props.isOn}
      href="#"
      onClick={props.onClick}
    >
      {CONSTANTS.STREAM_INFO[props.channel].name} <Icon i={props.icon} />
    </StyledStreamButton>
  );
}

export default StreamButton;
