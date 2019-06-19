import React from 'react';
import styled from 'styled-components';

import * as CONSTANTS from './constants.jsx';

import Icon from './Icon.jsx';

const Info = styled.a`
  &, &:hover {
    color: var(${props => props.isOn ? '--on' : '--off'});
    text-decoration: none;
  }

  &::before {
    content: '';
    padding: 0 .4rem 0 .4rem;
  }

  & i {
    padding-right: .1em;
  }

  @media (min-width: 576px) {
    &::before {
      content: '/';
      padding: 0 .4rem 0 .4rem;
    }
  }
`;

function StreamInfo(props) {
  let phone = CONSTANTS.STREAM_INFO[props.channel].phone;
  return (
    <React.Fragment>
      
    </React.Fragment>
  );
}

export default StreamInfo;
