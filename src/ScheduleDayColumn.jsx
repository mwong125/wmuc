import React from 'react';
import styled from 'styled-components';

import ScheduleShow from './ScheduleShow.jsx';

const StyledScheduleDayColumn = styled.div`
  padding: 0;

  @media (min-width: 576px) {
    background: ${props => props.background};
    border-left: 1px solid var(--background-color);
    border-right: 1px solid var(--background-color);
  }
`;

const StyledDay = styled.div`
  background: var(--background-color);
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  user-select: none;
  position: -webkit-sticky;
  position: sticky;
  z-index: 1;
  top: 0;

  #sun::after,
  #mon::after,
  #tues::after,
  #thurs::after,
  #fri::after {
  	content: 'day';
  }

  #wed::after {
  	content: 'nesday';
  }

  #sat::after {
  	content: 'urday';
  }

  @media (min-width: 576px) {
  	background: ${props => props.background};
  }

  @media (min-width: 576px) and (max-width: 992px) {
    #sun::after,
    #mon::after,
    #tues::after,
    #wed::after,
    #thurs::after,
    #fri::after,
    #sat::after {
      content: '';
    }
  }
`;

let days = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];

function prevEndHour(shows, index) {
  if (index === 0) {
    return 0;
  } else {
    return shows[index-1]._show_start_hour + shows[index-1]._show_duration;
  }
}

function lastShowPadding(shows, index) {
  let padding = 0;
  if (index === shows.length - 1) {
    return 24 - shows[index]._show_start_hour - shows[index]._show_duration;
  }
  return padding;
}

function ScheduleDayColumn(props) {
  let background = props.index % 2 === 0 ? 'var(--wmuc-gray)' : 'var(--wmuc-gray2)';
  return (
    <StyledScheduleDayColumn className="col-sm" background={background}>
      <StyledDay background={background}>
        <span id={days[props.index]}>{days[props.index]}</span>
      </StyledDay>
      {props.shows.sort(function(x,y) {return x._show_start_hour - y._show_start_hour;}).map(
        (show, index) =>
        <ScheduleShow
          key={show._show_id}
          show_id={show._show_id}
          name={show._show_name}
          djs={show._show_djs}
          description={show._show_description}
          start_hour={show._show_start_hour}
          duration={show._show_duration}
          background={background}
          prev_end_hour={prevEndHour(props.shows, index)}
          last_show_padding={lastShowPadding(props.shows, index)}
        />
      )}
    </StyledScheduleDayColumn>
  );
}

export default ScheduleDayColumn;
