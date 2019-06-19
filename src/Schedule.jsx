import React, { Component } from 'react';
import styled from 'styled-components';
import * as CONSTANTS from './constants.jsx';

import ScheduleOptions from './ScheduleOptions.jsx';
import ScheduleDayColumn from './ScheduleDayColumn.jsx';
import HourLabel from './HourLabel.jsx';

const StyledSchedule = styled.div`
  padding-top: 1rem;

  & > :first-child {
  	text-align: right;
  	font-weight: bold;
  	text-transform: uppercase;
  }

  & > :first-child > :first-child {
    background: var(--background-color);
    height: 2rem;
    line-height: 2rem;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
  }
`;

const StyledLeft = styled.div`
  position: relative;
  text-align: center;
  color: ${props => props.color};
  display: ${props => props.hide ? 'none' : 'block'};

  @media (min-width: 576px) {
  	text-align: right;
    display: block;
  }
`;

class Schedule extends Component {
	constructor(props) {
		super(props);
		this.state = {
      channel: props.match.path.slice(1),
      shows: []
		}

		this.setChannel = this.setChannel.bind(this);
	}

  componentDidMount() {
    fetch(CONSTANTS.STREAM_INFO[this.state.channel].api).then(res => res.json()).then(data => {
      this.setState({
        shows: data.showObjArray
      })
    });
    
  }

  setChannel(channel) {
    if (channel !== this.state.channel) {
      this.setState({
        channel: channel
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <StyledSchedule className="row">
          <div className="col-sm">
	          <StyledLeft color={'var(--wmuc-red)'} hide={false}>
	            {CONSTANTS.STREAM_INFO[this.state.channel].name}
	          </StyledLeft>
            {
              [...Array(24).keys()].map(
                (i) =>
                <StyledLeft color={'var(--color)'} hide={true}>
                  <HourLabel key={i} hour={i} />
                </StyledLeft>
              )
            }
          </div>
	        {this.state.shows.map(
	        	(day, index) =>
	        	<ScheduleDayColumn
	        	  key={index}
	        	  index={index}
	        	  shows={day}
	        	/>
	        )}
        </StyledSchedule>
      </React.Fragment>
    );
  }
}

export default Schedule;
