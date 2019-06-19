import React, { Component } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';

import Stream from './Stream.jsx';

const StyledNavStream = styled.nav`
  background: var(--background-color);
  text-transform: uppercase;
  font-size: small;
  border-top: 1px solid var(--color);
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
`;

class NavStream extends Component {
  constructor(props) {
    super(props);
    this.state = {isFMOn: false, isDigitalOn: false, url: ""};
    this.toggleFM = this.toggleFM.bind(this);
    this.toggleDigital = this.toggleDigital.bind(this);

  }

  toggleFM() {
    this.setState({
      isFMOn: !this.state.isFMOn,
      isDigitalOn: false,
      url: "http://wmuc.umd.edu:8000/wmuc-hq"
    });
  }

  toggleDigital() {
    this.setState({
      isFMOn: false,
      isDigitalOn: !this.state.isDigitalOn,
      url: "http://wmuc.umd.edu:8000/wmuc2-high"
    })
  }

  render() {
    return (
      <StyledNavStream className="navbar navbar-expand-lg">
        <Stream
          channel="fm"
          show="Shoebox Office"
          djs="Theresa Phan"
          isOn={this.state.isFMOn}
          onClick={this.toggleFM}
        />
        <Stream
          channel="digital"
          show="Shoebox Office"
          djs="Theresa Phan"
          isOn={this.state.isDigitalOn}
          onClick={this.toggleDigital}
        />
        <ReactPlayer url={this.state.url} playing={this.state.isDigitalOn || this.state.isFMOn} width="0" height="0" volume={1}/>
        {console.log( this.state.url + " " + this.state.isDigitalOn || this.state.isFMOn )}
      </StyledNavStream>
    );
  }
}

export default NavStream;