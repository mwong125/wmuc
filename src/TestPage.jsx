import React from 'react';
import ReactDOM from 'react-dom';

class TestPage extends React.Component {
    constructor(props) {
        super(props);
        this.getUsersArray = this.getUsersArray.bind(this);
        this.getDgShowsArray = this.getDgShowsArray.bind(this);
        this.getFmShowsArray = this.getFmShowsArray.bind(this);
        this.getUserByName = this.getUserByName.bind(this);
        this.getShowByName = this.getShowByName.bind(this);
        this.getShowById = this.getShowById.bind(this);
        this.putUser = this.putUser.bind(this);
        this.putShow = this.putShow.bind(this);
    }
    getUsersArray() {
        fetch('/api/get/users/').then(resObj => resObj.json()).then(data => {
          console.log("The user object array is: ");
          console.log(data.userObjArray);
        });
    }
    getDgShowsArray() {
        fetch('/api/get/shows/dg/').then(resObj => resObj.json()).then(data => {
            var day = 0;
            for (var showDayArray of data.showObjArray) {
                console.log("Day " + day + " digital shows are: ");
                console.log(showDayArray);
                day++;
            }
        });
    }
    getFmShowsArray() {
        fetch('/api/get/shows/fm/').then(resObj => resObj.json()).then(data => {
            var day = 0;
            for (var showDayArray of data.showObjArray) {
                console.log("Day " + day + " fm shows are: ");
                console.log(showDayArray);
                day++;
            }
        });
    }
    getUserByName() {
        var user_name = document.getElementById('user_name').value;
        console.log("test user name " + user_name);
        console.log("/api/get/users/" + user_name + "/");
        fetch('/api/get/users/' + user_name + '/').then(resObj => resObj.json()).then(data => {
            console.log("The user object is: ");
            console.log(data.userObj);
        });
    }
    /*
     * the two fetch methods below both query the same express.get() method
     * but show and id are parameters for :iden in server call /api/shows/:iden/:value
     */
    getShowByName() {
        var show_name = document.getElementById('show_name').value;
        fetch('/api/get/shows/name/' + show_name + '/').then(resObj => resObj.json()).then(data => {
            console.log("The show object is: ");
            console.log(data.showObj);
        });
    }
    getShowById() {
        var show_id = document.getElementById('show_id').value;
        fetch('/api/get/shows/id/' + show_id + '/').then(resObj => resObj.json()).then(data => {
            console.log("The show object is: ");
            console.log(data.showObj);
        });
    }
    putUser() {
        let newUserInfo = {
            user_name: document.getElementById('put_user_name').value,
            user_pass: document.getElementById('put_user_pass').value,
            user_bio: document.getElementById('put_user_bio').value,
            user_pic: "https://via.placeholder.com/150"
        };
        fetch('/api/put/user/', {
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
    putShow() {
        let newShowInfo = {
            show_name: document.getElementById('put_show_name').value,
            show_description: document.getElementById('put_show_description').value,
            show_genre: document.getElementById('put_show_genre').value,
            show_day: document.getElementById('put_show_day').value,
            show_start_hour: document.getElementById('put_show_start').value,
            show_duration: document.getElementById('put_show_duration').value,
            channel: document.querySelector('input[name="put_channel"]:checked').value
        };
        fetch('/api/put/show/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(newShowInfo)
        }).then(resObj => resObj.json()).then(data => {
            console.log("Show put operation status is: " + data.put_status);
            console.log(data.put_message);
        });
    }
    updUserGetInfo() {
        var user_name = document.getElementById('upd_user_name').value;
        fetch('/api/get/users/' + user_name + '/').then(resObj => resObj.json()).then(data => {
            let userObj = data.userObj;
            if (userObj != null) {
                console.log(userObj);
                document.getElementById('upd_user_pass').value = userObj._user_pass;
                document.getElementById('upd_user_bio').value = userObj._user_bio;
            }
        });
    }
    updUserPutInfo() {
        let updUserInfo = {
            user_name: document.getElementById('upd_user_name').value,
            user_pass: document.getElementById('upd_user_pass').value,
            user_bio: document.getElementById('upd_user_bio').value
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
        });
    }
    updShowGetInfo() {
        var show_name = document.getElementById('upd_show_name').value;
        var show_id = document.getElementById('upd_show_id').value;
        let show_identifier;
        let show_value;
        if (show_name != "" && show_name != null) {
            show_identifier = "name";
            show_value = show_name;
        } else {
            show_identifier = "id";
            show_value = show_id;
        }
        fetch('/api/get/shows/' + show_identifier + '/' + show_value).then(resObj => resObj.json()).then(data => {
            let showObj = data.showObj;
            if (showObj != null) {
                document.getElementById('upd_show_id').value = showObj._show_id;
                document.getElementById('upd_show_name').value = showObj._show_name;
                document.getElementById('upd_show_description').value = showObj._show_description;
                document.getElementById('upd_show_genre').value = showObj._show_genre;
                document.getElementById('upd_show_day').value = showObj._show_day = showObj._show_day;
                document.getElementById('upd_show_start').value = showObj._show_start_hour;
                document.getElementById('upd_show_duration').value = showObj._show_duration;
            }
        });
    }
    updShowPutInfo() {
        let updShowInfo = {
            show_name: document.getElementById('upd_show_name').value,
            show_description: document.getElementById('upd_show_description').value,
            show_genre: document.getElementById('upd_show_genre').value,
            show_day: document.getElementById('upd_show_day').value,
            show_start_hour: document.getElementById('upd_show_start').value,
            show_duration: document.getElementById('upd_show_duration').value,
            show_id: document.getElementById('upd_show_id').value
        };
        fetch('/api/update/show/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(updShowInfo)
        }).then(resObj => resObj.json()).then(data => {
            console.log("User update operation status is: " + data.upd_status);
            console.log(data.upd_message);
        });
    }
    deleteUser() {
        let deleteUserInfo = {
            user_name: document.getElementById('delete_user_name').value
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
    }
    deleteShow() {
        let deleteShowInfo = {
            show_id: document.getElementById('delete_show_id').value
        };
        fetch('/api/delete/show/', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(deleteShowInfo)
        }).then(resObj => resObj.json()).then(data => {
            console.log("Show delete operation status is: " + data.delete_status);
            console.log(data.delete_message);
        });
    }

    render() {
        return(
            <div>
              <h3 className="pt-5">Getting show/dj info</h3>
              <div className="form-group row mb-5">
                <button className="btn btn-outline-light" onClick={this.getUsersArray}>Get users array</button>
                <button className="btn btn-outline-light" onClick={this.getDgShowsArray}>Get digital shows array</button>
                <button className="btn btn-outline-light" onClick={this.getFmShowsArray}>Get FM shows array</button>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">User name: </label>
                <div className="col-sm-5">
                  <input className="form-control" id="user_name" type="text" defaultValue="Firstname Lastname"></input>
                </div>
                <div className="col-sm-5">
                  <button className="btn btn-block btn-outline-light" onClick={this.getUserByName}>Get specific user by name</button>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Show ID: </label>
                <div className="col-sm-5">
                  <input className="form-control" id="show_id" type="text" defaultValue="####"></input>
                </div>
                <div className="col-sm-5">
                  <button className="btn btn-block btn-outline-light" onClick={this.getShowById}>Get specific show by id</button>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Show name: </label>
                <div className="col-sm-5">
                  <input className="form-control" id="show_name" type="text" defaultValue="CDepot Selections"></input>
                </div>
                <div className="col-sm-5">
                  <button className="btn btn-block btn-outline-light" onClick={this.getShowByName}>Get specific show by name</button>
                </div>
              </div>

              <h3 className="pt-5">Create a new DJ</h3>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">User name: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_user_name" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Password: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_user_pass" type="password" />
                </div>
              </div>



              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Bio: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_user_bio" type="text"/>
                </div>
              </div>
              <button className="btn btn-outline-light" onClick={this.putUser}>Create User</button>

              <h3 className="pt-5">Create a new show</h3><br/>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Show name: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_show_name" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Description: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_show_description" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Genre: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_show_genre" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Day (0-6): </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_show_day" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Start hour (0-23): </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_show_start" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Duration: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="put_show_duration" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Channel</label>
                <div className="col-sm-10">
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" id="put_channel_fm" name="put_channel" value="fm"/><span className="mr-5">FM</span>
                    <input className="form-check-input" type="radio" id="put_channel_dg" name="put_channel" value="dg"/>Digital
                  </div>
                </div>
              </div>
              <button className="btn btn-outline-light" onClick={this.putShow}>Create Show</button>

              <h3 className="pt-5">Update an existing user</h3>
              <p>
                Enter the user name of current user and choose get current info.
                Change the necessary fields except for the primary key user name and choose update.
              </p>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Primary key user name</label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_user_name" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Password: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_user_pass" type="password"/>
                </div>
              </div>



              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Bio: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_user_bio" type="text"/>
                </div>
              </div>
              <button className="btn btn-outline-light" onClick={this.updUserGetInfo}>Get Current User Info</button>
              <button className="btn btn-outline-light" onClick={this.updUserPutInfo}>Update User Info</button>

              <h3 className="pt-5">Update an existing show</h3><br/>
              <p>
                Enter the ID of the existing show you would like to update.
                If you do not know the ID of the show, enter in the show name instead and hit get info.
                Then edit the necessary fields except for the primary key ID.
              </p>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Primary key show id: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_show_id" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Show name: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_show_name" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Description: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_show_description" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Genre: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_show_genre" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Day: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_show_day" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Start hour: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_show_start" type="text"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Duration: </label>
                <div className="col-sm-10">
                  <input className="form-control" id="upd_show_duration" type="text"/>
                </div>
              </div>
              <button className="btn btn-outline-light" onClick={this.updShowGetInfo}>Get Current Show Info</button>
              <button className="btn btn-outline-light" onClick={this.updShowPutInfo}>Update Show Info</button>

              <h3 className="pt-5">Delete a show/user</h3>
              <p>
                <q>With great power comes great responsibility.</q> -Spiderman's Uncle
              </p>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">User name: </label>
                <div className="col-sm-5">
                  <input className="form-control" id="delete_user_name" type="text"/>
                </div>
                <div className="col-sm-5">
                  <button className="btn btn-block btn-outline-light" onClick={this.deleteUser}>Delete User</button>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Show ID: </label>
                <div className="col-sm-5">
                  <input className="form-control" id="delete_show_id" type="text"/>
                </div>
                <div className="col-sm-5">
                  <button className="btn btn-block btn-outline-light" onClick={this.deleteShow}>Delete Show</button>
                </div>
              </div>
            </div>
        );
    }
}

export default TestPage;
