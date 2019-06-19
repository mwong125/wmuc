{/*AUTHOR: Alina*/}

import React, { Component } from 'react';
import styled from 'styled-components';
import * as CONSTANTS from './constants.jsx';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SplitterLayout from 'react-splitter-layout';
import FileBase64 from 'react-file-base64';
var b64toBlob = require('b64-to-blob');
const blobToBase64 = require('blob-to-base64')

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


class DJPage extends Component {

  constructor(props){
    super(props);
    this.state = {user_data: [], orig_data: [], files: {}}
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.loadItem = this.loadItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.convert = this.convert.bind(this);
  }


  componentDidMount(){

    fetch('/api/get/users/').then(resObj => resObj.json()).then(data => {
          this.setState({user_data: data.userObjArray, orig_data: data.userObjArray})
    });


  }

  componentWillReceiveProps(nextProps){
    this.setState({
      orig_data: nextProps.userObjArray
    })
  }

  getFiles(files){
    this.setState({files: files});
  }

  addItem(e){
    e.preventDefault();
    var contentType = 'image/jpeg';
    if(this.state.files.base64 != null){
      var blob = b64toBlob(this.state.files.base64.substring(23), contentType);
      var b64 = this.state.files.base64;

      URL.createObjectURL(blob);
      let newUserInfo = {
          user_name: document.getElementById('name').value,
          user_pass: document.getElementById('pswd').value,
          user_pic: b64,
          user_bio: document.getElementById('bio').value
      };
      fetch('/api/put/user', {
          method: "POST",
          headers: {
              "Content-Type" : "application/json; charset=utf-8"
          },
          body: JSON.stringify(newUserInfo)
      }).then(resObj => resObj.json()).then(data => {
          console.log("User put operation status is: " + data.put_status);
          console.log(data.put_message);
      });
    }else{
      let newUserInfo = {
          user_name: document.getElementById('name').value,
          user_pass: document.getElementById('pswd').value,
          user_bio: document.getElementById('bio').value,
          user_pic: "https://via.placeholder.com/150"
      };
      fetch('/api/put/user', {
          method: "POST",
          headers: {
              "Content-Type" : "application/json; charset=utf-8"
          },
          body: JSON.stringify(newUserInfo)
      }).then(resObj => resObj.json()).then(data => {
          console.log("User put operation status is: " + data.put_status);
          console.log(data.put_message);
      });
    }

    fetch('/api/get/users/').then(resObj => resObj.json()).then(data => {
          this.setState({user_data: data.userObjArray, orig_data: data.userObjArray})
    });

  }

  loadItem(e){
    e.preventDefault();
    var user_name = document.getElementById('name').value;
    fetch('/api/get/users/' + user_name + '/').then(resObj => resObj.json()).then(data => {
        let userObj = data.userObj;
        if (userObj != null) {
            document.getElementById('pswd').value = userObj._user_pass;
            document.getElementById('bio').value = userObj._user_bio;
            {/*
            TODO: find some way to load this from the db too
            document.getElementById('image').value = userObj._user_pic;
            */


            }
        }
    });

  }

  removeItem(e){
   e.preventDefault();
   let deleteUserInfo = {
       user_name: document.getElementById('name').value
   };
   fetch('/api/delete/user/', {
       method: "DELETE",
       headers: {
           "Content-Type": "application/json; charset=utf-8"
       },
       body: JSON.stringify(deleteUserInfo)
   }).then(resObj => resObj.json()).then(data => {
       console.log("User delete operation status is: " + data.delete_status);
       console.log(data.delete_message);
   });
   fetch('/api/get/users/').then(resObj => resObj.json()).then(data => {
         this.setState({user_data: data.userObjArray, orig_data: data.userObjArray})
   });
  }

  updateItem(e){
    e.preventDefault();
    var contentType = 'image/jpeg';
    if(this.state.files.base64 != null){
      var blob = b64toBlob(this.state.files.base64.substring(23), contentType);
      var b64 = this.state.files.base64;
      let updUserInfo = {
          user_name: document.getElementById('name').value,
          user_pass: document.getElementById('pswd').value,
          user_pic: b64,
          user_bio: document.getElementById('bio').value
      };
      fetch('/api/update/user/', {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(updUserInfo)
      }).then(resObj => resObj.json()).then(data => {
          console.log("User update operation status is: " + data.upd_status);
          console.log(data.upd_message);
          fetch('/api/get/users/').then(resObj => resObj.json()).then(data => {
            this.setState({user_data: data.userObjArray, orig_data: data.userObjArray})});
      });
    }else{
      let updUserInfo = {
          user_name: document.getElementById('name').value,
          user_pass: document.getElementById('pswd').value,
          user_bio: document.getElementById('bio').value
      };
      fetch('/api/update/user/', {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(updUserInfo)
      }).then(resObj => resObj.json()).then(data => {
          console.log("User update operation status is: " + data.upd_status);
          console.log(data.upd_message);
          fetch('/api/get/users/').then(resObj => resObj.json()).then(data => {
            this.setState({user_data: data.userObjArray, orig_data: data.userObjArray})});
      });

    }



  }

  handleChange(e){
    let currentList = [];
    let newList = [];
    if(e.target.value !== ""){
      currentList = this.state.orig_data;
      newList = currentList.filter(item => {
        const lc = item._user_name.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    }else{
      newList = this.state.orig_data;
    }
    this.setState({user_data: newList});
  }

convert(e){
  return blobToBase64(new Blob(e, {type: "image/jpeg"}), function(error, base64){
  document.getElementById("propic").src = base64;});
}

render() {

    return(
      <React.Fragment>
        <div id="djs" className="px-1">
          <SplitterLayout>


            <div className="col-sm">
              <div className="row py-5">
                <h1>WMUC DJs</h1>
                <input type="text" className="input" onChange={this.handleChange} placeholder="Search DJs..."/>
              </div>
              {this.state.user_data.map((obj) =>
              (
                <div className="media mb-5">
                  <img className="mr-3 rounded-circle" src={obj._user_pic} height="125px" width="125px" id="propic" alt="Image"  placeholder="https://via.placeholder.com/150" />
                  <div className="media-body">
                    <h5 className="mt-0">


                      {obj._user_name}



                    </h5>
                    <div>
                      Shows: {obj._user_shows.join(" --|-- ")}
                      <br/>
                      Bio: {obj._user_bio}
                    </div>
                  </div>

                </div>

              )

              )}
            </div>


            <div className="col-sm">
              <section className="section">
                <h2>Add/Edit DJ Information</h2>
                <form className="form" id="addItemForm">
                  <input type="text" className="input" id="name" placeholder="Name"/>
                  <button className="button" onClick={this.loadItem}>Load Info</button><br/>
                  <input type="password" id="pswd" placeholder="Password"/><br/>
                  <textarea rows="5" cols="40" id="bio" placeholder="Bio"/><br/>
                  Image: <FileBase64
                  multiple={ false }
                  onDone={ this.getFiles.bind(this) } />
                  <button className="button" onClick={this.addItem}>Add New DJ</button>
                  <button className="button" onClick={this.updateItem}>Update</button>
                  <button className="button" onClick={this.removeItem}>Delete</button>
                </form>
              </section>
            </div>
          </SplitterLayout>

        </div>
      </React.Fragment>
    );
  }
}


export default DJPage;
