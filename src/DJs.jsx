import React from 'react';
import styled from 'styled-components';

const StyledDJs = styled.span`
  &:before {
  	content: ' with ';
  }

  @media (min-width: 576px) {
  	display: block;

  	&:before {
  	  content: '';
  	}
  }
`;

function formatDJs(djs) {
  if (djs.length > 1) {
    djs[djs.length-1] = 'and ' + djs[djs.length-1];
  }
  if (djs.length > 2) {
    return djs.join(', ');
  } else {
    return djs.join(' ');
  }
}

function DJs(props) {
  return(
    <StyledDJs>
      {formatDJs(props.djs)}
    </StyledDJs>
  );
}

export default DJs;