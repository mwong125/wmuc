{/*AUTHOR: Alina*/}

import React, { Component } from 'react';
import styled from 'styled-components';





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




class Login extends Component {

  constructor(props){
    super(props);

  }


  componentDidMount(){


  }

render() {


    return(
      <React.Fragment>
        <form id="loginForm">
          <input type="text" id="username" placeholder="Username"/>
          <br/>
          <input type="password" id="password"/>
          <br/>
          <input type="button" id="loginButton" value="Log In"/>
        </form>
      </React.Fragment>
    );
  }
}


export default Login;
