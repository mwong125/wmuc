import React from 'react';
import { Link } from 'react-router-dom';
import * as CONSTANTS from './constants.jsx';

let classes = "btn btn-outline-light";

function ChannelButton(props) {
	if (props.channel === props.label) {
	  classes += " active";
	}

  return (
    <button type="button" className={classes}>
      <Link to={"/" + props.label}>
        {CONSTANTS.STREAM_INFO[props.label].name}
      </Link>
    </button>
  );
}

export default ChannelButton;
