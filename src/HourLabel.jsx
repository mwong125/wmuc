import React from 'react';
import styled from 'styled-components';

import Hour from './Hour.jsx';

const StyledHourLabel = styled.div`
  text-align: right;
  display: block;
  padding-bottom: 100%;
`;

const StyledContent = styled.div`
    position: absolute;
  	height: 100%;
  	width: 100%;
  }
`;

function HourLabel(props) {
  return (
    <StyledHourLabel>
      <StyledContent>
        <Hour hour={props.hour} />
      </StyledContent>
    </StyledHourLabel>
	);
}

export default HourLabel;
