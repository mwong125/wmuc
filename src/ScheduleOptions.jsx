import React from 'react';

import ChannelButtonGroup from './ChannelButtonGroup.jsx';

function ScheduleOptions(props) {
return (
  <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with schedule options">
    <ChannelButtonGroup channel={props.channel} onClickChannel={props.onClickChannel} />
  </div>
);
}

export default ScheduleOptions;
