/*middleware and server*/
const express = require('express');
const bodyParser = require('body-parser');

/*app model*/
const DjScheduleManager = require('./model/Model.js');
const DJ = require('./model/DJ.js');
const Show = require('./model/Show.js');
/*
 * DJ/Schedule manager object is instantiated and initialized with /model/schedule_data.json
 * updateSQL() is called to make sure the database and object in server memory match
 *
 */
const schedule_json = require('./model/schedule_data.js').schedule;
const db_header = require('./database/header.js');
appManager = new DjScheduleManager(schedule_json, db_header.dbInfo, db_header.dbTables, true, true);
//appManager.updateSQL();

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

/* routing api for get methods */
app.get('/api/get/users/', function(reqObj, resObj) {
    console.log("received mysql users array get request");
    appManager.getAllUsersSQL(function(results) {
	let resObjData = { userObjArray: results };
	resObj.json(resObjData);
    });
});

app.get('/api/get/users/:user_name/', function(reqObj, resObj) {
    var user_name = reqObj.params.user_name;
    console.log("received mysql specific user get request for user_name: " + user_name);
    appManager.getSpecificUserSQL(user_name, function(results) {
	let resObjData = { userObj: results };
	resObj.json(resObjData);
    });
});

app.get('/api/get/shows/:channel/', function(reqObj, resObj) {
    var channel = reqObj.params.channel;
    console.log("received mysql " + channel + " shows array get request");
    appManager.getAllShowsSQL(channel, function(results) {
	let showArray = new Array(7).fill().map(() => new Array(0).fill(0));
	for (let showObj of results) {
	    showArray[showObj.show_day].push(showObj);
	}
	let resObjData = { showObjArray: showArray };
	resObj.json(resObjData);
    });
});

app.get('/api/get/shows/:show_identifier/:identifier_value/', function(reqObj, resObj) {
    var value = reqObj.params.identifier_value;
    var identifier = reqObj.params.show_identifier;
    console.log("received specific mysql show get request for " + identifier + ": " + value);
    let resObjData;
    if (identifier == "name") {
	appManager.getSpecificShowByName(value, function(results) {
	    resObjData = { showObj: results };
	    resObj.json(resObjData);
	});
    } else {
	appManager.getSpecificShowById(value, function(results) {
	    resObjData = { showObj: results };
	    resObj.json(resObjData);
	});
    }
});

/* routing api for post-put methods */

app.post('/api/post/FetchCurrentShows/', function(reqObj, resObj) {
    var show_day =  reqObj.body.show_day;
    var show_start_hour = reqObj.body.show_start_hour;
    console.log("curr show day: " + show_day);
    console.log("curr show hour: " + show_start_hour);
    appManager.getCurrentShowsSQL(show_day, show_start_hour, function(fmShowObj, dgShowObj) {
      let resObjData = {
        fmShow: fmShowObj,
        dgShow: dgShowObj
      };
      resObj.json(resObjData);
    });
});

app.post('/api/put/user/', function(reqObj, resObj) {
    var user_name = reqObj.body.user_name;
    var user_pass = reqObj.body.user_pass;
    var user_pic = reqObj.body.user_pic;
    var user_bio = reqObj.body.user_bio;
    console.log("received put request for new user primary key name: " + user_name);
    appManager.putUser(user_name, user_pass, user_pic, user_bio, function(status, message) {
	let resObjData = { put_status: status, put_message: message };
	resObj.json(resObjData);
    });
});

app.post('/api/put/show/', function(reqObj, resObj) {
    var show_name = reqObj.body.show_name;
    var show_description = reqObj.body.show_description;
    var show_genre = reqObj.body.show_genre;
    var show_day = reqObj.body.show_day;
    var show_start_hour = reqObj.body.show_start_hour;
    var show_duration = reqObj.body.show_duration;
    var channel = reqObj.body.channel;
    console.log("received put request for new show name: " + show_name);
    appManager.putShow(show_name, show_description, show_genre, show_day, show_start_hour, show_duration, channel, function(status, message) {
	let resObjData = { put_status: status, put_message: message };
	resObj.json(resObjData);
    });
});

/* routing api for post-update methods */

app.post('/api/update/user/', function(reqObj, resObj) {
    console.log("received update request for user name: " + reqObj.body.user_name);
    let newUserObj = new DJ(reqObj.body.user_name, reqObj.body.user_pass,
			    reqObj.body.user_pic, reqObj.body.user_bio);
    appManager.getSpecificUserSQL(newUserObj.user_name, function(oldUserObj) {
	appManager.updUserSQL(newUserObj,
			      oldUserObj.user_pass == newUserObj.user_pass,
			      oldUserObj.user_pic == newUserObj.user_pic,
			      oldUserObj.user_bio == newUserObj.user_bio, function(err, results) {
				  if (err) {
				      throw err;
				  } else {
				      let resObjData;
				      let message;
				      if (results) {
					  let message = "update success! primary key user_name: " + newUserObj.user_name;
					  if (oldUserObj.user_pass != newUserObj.user_pass) {
					      message += "\n -new user_pass: " + newUserObj.user_pass;
					  }
					  if (oldUserObj.user_pic != newUserObj.user_pic) {
					      message += "\n -new user_pic: " + newUserObj.user_pic;
					  }
					  if (oldUserObj.user_bio != newUserObj.user_bio) {
					      message += "\n -new user_bio: " + newUserObj.user_bio;
					  }
					  resObjData = { upd_status: true, upd_message: message };
				      } else {
					  resObjData = { upd_status: false, upd_mesage: "update unsuccessful. no fields were changed for primary key user_name: " + oldUserObj.user_name };
				      }
				      resObj.json(resObjData);
				  }
			      });
    });
});

app.post('/api/update/show/', function(reqObj, resObj) {
    console.log("received update request for show id: " + reqObj.body.show_id);
    let newShowObj = new Show(reqObj.body.show_name,
			      null,
			      reqObj.body.show_description,
			      reqObj.body.show_genre,
			      reqObj.body.show_day,
			      reqObj.body.show_start_hour,
			      reqObj.body.show_duration,
			      reqObj.body.show_id);
    appManager.getSpecificShowById(newShowObj.show_id, function(oldShowObj) {
	appManager.updShowSQL(newShowObj, oldShowObj._show_channel,
			      newShowObj.show_name == oldShowObj.show_name,
			      newShowObj.show_description == oldShowObj.show_description,
			      newShowObj.show_genre == oldShowObj.show_genre,
			      newShowObj.show_day == oldShowObj.show_day,
			      newShowObj.show_start_hour == oldShowObj.show_start_hour,
			      newShowObj.show_duration == oldShowObj.show_duration, function(err, results) {
				  if (err) {
				      throw err;
				  } else {
				      let resObjData;
				      let message;
				      if (results) {
					  message = "update success! primary key show_id: " + newShowObj.show_id;
					  if (newShowObj.show_name != oldShowObj.show_name) {
					      message += "\n -new show_name: " + newShowObj.show_name;
					  }
					  if (newShowObj.show_description != oldShowObj.show_description) {
					      message += "\n -new show_description: " + newShowObj.show_description;
					  }
					  if (newShowObj.show_genre != oldShowObj.show_genre) {
					      message += "\n -new show_genre: " + newShowObj.show_genre;
					  }
					  if (newShowObj.show_day != oldShowObj.show_day) {
					      message += "\n -new show_day: " + newShowObj.show_day;
					  }
					  if (newShowObj.show_start_hour != oldShowObj.show_start_hour) {
					      message += "\n -new show_start_hour: " + newShowObj.show_start_hour;
					  }
					  if (newShowObj.show_duration != oldShowObj.show_duration) {
					      message += "\n -new show_duration: " + newShowObj.show_duration;
					  }
					  resObjData = { upd_status: true, upd_message: message };
				      } else {
					  resObjData = { upd_status: false, upd_message: "update unsuccessful. no fields were changed for primary key show_id: " + oldShowObj.show_id };
				      }
				      resObj.json(resObjData);
				  }
			      });
    });
});

/*  routing api for delete methods */

app.delete('/api/delete/user/', function(reqObj, resObj) {
    console.log("received delete request for user name: " + reqObj.body.user_name);
    var user_name = reqObj.body.user_name;
    appManager.deleteUser(user_name, function(delete_result) {
	let message;
	if (delete_result) {
	    message = "delete successful! user entry deleted for primary key user_name:  " + user_name;
	} else {
	    message = "delete unsuccessful. user entry does not exist for primary key user_name: " + user_name;
	}
	let resObjData = { delete_status: delete_result, delete_message: message };
	resObj.json(resObjData);
    });
});

app.delete('/api/delete/show/', function(reqObj, resObj) {
    console.log("received delete request for show id: " + reqObj.body.show_id);
    var show_id = reqObj.body.show_id;
    appManager.getSpecificShowById(show_id, function(showObj) {
	appManager.deleteShow(show_id, showObj, function(delete_result) {
	    let message;
	    if (delete_result) {
		message = "delete successful! show entry deleted for primary key show_id: " + show_id;
	    } else {
		message = "delete unsuccessful. show entry does not exist for primary key show_id: " + show_id;
	    }
	    let resObjData = { delete_status: delete_result, delete_message: message };
	    resObj.json(resObjData);
	});
    });
});

app.listen(3000, function() {
    console.log('App started');
});
