{/*AUTHOR: Alina*/}

import React, { Component } from 'react';
import styled from 'styled-components';
import * as CONSTANTS from './constants.jsx';









{/*using match to get name of dj from route*/}
function DJInfo({match}){
  var user_data = [];
  let djName = match.params.value;
  {/*djName = djName.replace("%20", " ");*/}

  console.log("dj name as call " + djName);
   {/*fetch('http://localhost:3000/api/users/' + djName + '/').then(resObj => resObj.json()).then(data => {
        user_data = data.userObj});
    console.log(user_data._user_name);*/}

    fetch('/api/users/' + djName + '/').then(resObj => resObj.json()).then(data => {
        user_data = data.userObj;
        console.log("ud inside fetch " + user_data);

    });

    return (
      <React.Fragment>

        <div className="media mb-5">
          <img className="mr-3 rounded-circle" src="http://placehold.it/64x64"  alt="DJ Profile image" />
          <div className="media-body">
            <h5 className="mt-0">
              --Name--
              {user_data}
              --/name--
            </h5>
            --Bio--
            {user_data._user_bio}
            --/bio--
            <div>
              Shows:
            </div>
          </div>

        </div>

      </React.Fragment>
    );
    console.log("ud after fetch " + user_data);





  }


export default DJInfo;
