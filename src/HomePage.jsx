import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import * as CONSTANTS from './constants.jsx';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false
    }

    this.login = this.login.bind(this);
  }

  login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username.length > 50) {
      alert("Username is too long.");
    } else {
      let l = CONSTANTS.WMUC.length;
      for (var i = 0; i < l; i++) {
        let user = CONSTANTS.WMUC[i];
        if((user.username == username) && (user.password == password)){
          CONSTANTS.FAKE_AUTH.authenticate(() => {
            this.setState(() => ({
              redirectToReferrer: true
            }))
          })
        }
      }
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/admin' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <div className="form-group">
        <label>USERNAME</label>
        <input id="username" type="text" className="form-control mb-4" />
        <label>PASSWORD</label>
        <input id="password" type="password" className="form-control mb-4" />
        <button className="btn btn-outline-light" onClick={this.login}>Log in</button>
      </div>
    )
  }
}

export default HomePage;
