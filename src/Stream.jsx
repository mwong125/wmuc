import React from 'react';
import styled from 'styled-components';

import StreamInfo from './StreamInfo.jsx';
import StreamButton from './StreamButton.jsx';

const StyledStream = styled.div`
  margin-right: auto;
`;

function Stream (props) {
  let icon = props.isOn ? 'pause' : 'play';
  return (
    <StyledStream>
      <StreamButton
        isOn={props.isOn}
        channel={props.channel}
        icon={icon}
        onClick={props.onClick}
        url={props.url}
      />
      <StreamInfo
        isOn={props.isOn}
        show={props.show}
        djs={props.djs}
        channel={props.channel}
      />
    </StyledStream>
  );
}

export default Stream;
