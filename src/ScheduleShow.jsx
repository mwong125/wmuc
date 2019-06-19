import React from 'react';
import styled from 'styled-components';

import Hour from './Hour.jsx';
import DJs from './DJs.jsx';

const StyledScheduleShow = styled.div`
  @media (min-width: 576px) {
  	display: block;
  	padding-bottom: ${props => props.duration * 100}%;
    background: ${props => props.isOffTheAir ? 'var(--background-color)' : 'none'};
  }
`;

const StyledContent = styled.div`
  padding: 0 1rem 2rem 1rem;
  display: ${props => props.isOffTheAir ? 'none' : 'block'};
  pointer-events: ${props => props.isOffTheAir ? 'none' : 'auto'};

  @media (min-width: 576px) {
    display: block;
  	text-align: center;
  	position: absolute;
  	width: 100%;
  	padding: 0 1px;
  	border-top: 2px solid var(--background-color);
  }

  @media (min-width: 576px) {
    font-size: .9vw;
  }

  @media (min-width: 1200px) {
    font-size: .8rem;
  }
`;

const StyledHours = styled.span`
  display: block;
  text-transform: uppercase;
  font-weight: bold;
  font-size: small;

  @media (min-width: 576px) {
  	display: none;
  }
`;

const StyledDescription = styled.span`
  display: block;
  font-size: small;

  @media (min-width: 576px) {
  	display: none;
  }
`;

function ScheduleShow(props) {
  return (
    <React.Fragment>
    <StyledScheduleShow duration={props.start_hour - props.prev_end_hour} isOffTheAir={true}>
      <StyledContent isOffTheAir={true} />
    </StyledScheduleShow>
    <StyledScheduleShow duration={props.duration} isOffTheAir={false}>
      <StyledContent isOffTheAir={false}>
        <StyledHours>
          <Hour hour={props.start_hour} />
          -
          <Hour hour={props.start_hour + props.duration} />
        </StyledHours>
        <a href={"http://wmuc.umd.edu/station/shows/" + props.show_id} title={props.description}>
          {props.name}
        </a>
        <DJs djs={props.djs} />
        <StyledDescription>
          {props.description}
        </StyledDescription>
      </StyledContent>
    </StyledScheduleShow>
    <StyledScheduleShow duration={props.last_show_padding} isOffTheAir={true}>
      <StyledContent isOffTheAir={true} />
    </StyledScheduleShow>
    </React.Fragment>
	);
}

export default ScheduleShow;
