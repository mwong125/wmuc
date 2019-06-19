import React, { Component } from 'react';

import ChannelButton from './ChannelButton.jsx';

class ChannelButtonGroup extends Component {
  render() {
    return (
      <div className="btn-group" role="group" aria-label="Toggle channel">
        <ChannelButton channel={this.props.channel} label="fm" onClickChannel={this.props.onClickChannel} />
        <ChannelButton channel={this.props.channel} label="digital" onClickChannel={this.props.onClickChannel} />
      </div>
    );
  }
}

export default ChannelButtonGroup;
