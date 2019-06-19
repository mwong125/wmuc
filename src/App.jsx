import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import './App.css';

import Nav from './Nav.jsx';
import NavStream from './NavStream.jsx';
import HomePage from './HomePage.jsx';
import Schedule from './Schedule.jsx';
import DJPage from './DJPage.jsx';
import DJInfo from './DJInfo.jsx';
import TestPage from './TestPage.jsx';
import Login from './Login.jsx';

import * as CONSTANTS from './constants.jsx';

const StyledContainer = styled.div`
  padding: 1rem 1rem 93px 1rem;
`;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    CONSTANTS.FAKE_AUTH.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
  )} />
);

function App() {
  return (
    <Router>
      <React.Fragment>
      {/*home page: nav bar, all possible routes, nav stream at bottom  */}
        <Nav />

          <StyledContainer className="container">
            <Route exact path="/" component={HomePage} />
            <PrivateRoute path="/djs" component={DJPage} />
            <PrivateRoute path="/fm" component={Schedule} channel="fm" />
            <PrivateRoute path="/digital" component={Schedule} channel="digital" />
            <PrivateRoute path="/admin" component={TestPage}/>
            {/*value is a param that will be filled in with name*/}
            {/*send to component djinfo which can access value*/}
            <Route path="/djinfo/:value" component={DJInfo}/>
          </StyledContainer>
        <NavStream />
      </React.Fragment>
    </Router>
  );
}

export default App;
