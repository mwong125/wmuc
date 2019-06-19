
const mysql = require('mysql');

const DJ = require('./DJ.js');
const Show = require('./Show.js');

/*
   the schedule class has changed to a dj and schedule manager sorta thing
*/
module.exports = class DjScheduleManager {

    constructor(schedule_json, dbInfo, dbTables, transform=true, connect=true) {
	this.schedule_json = schedule_json;
	this.dbInfo = dbInfo;
	this.dbTables = dbTables;
	this._sql_results = null;
	this._dj_list = new Array();
	this._dg_shows = new Array(7).fill().map(() => new Array(0).fill(0));
	this._fm_shows = new Array(7).fill().map(() => new Array(0).fill(0));
	if (transform) {
	    DjScheduleManager.jsonToObj(schedule_json, this._dj_list, this._dg_shows, this._fm_shows);
	}
	if (connect) {
	    this.connection = mysql.createConnection(dbInfo);
	} else {
	    this.connection = null;
	}
    }
    /*
     * get and setter methods
     */
    getUserByName(user_name) {
	for (var userObj of this.dj_list) {
	    if (userObj.user_name == user_name) {
		return userObj;
	    }
	}
	return null; //gotta figure out something else to return
    }
    getShowByName(show_name) {
	for (var showWeek of this.dg_shows) {
	    for (var showObj of showWeek) {
		if (showObj.show_name == show_name) {
		    return showObj;
		}
	    }
	}
	for (var showWeek of this.fm_shows) {
	    for (var showObj of showWeek) {
		if (showObj.show_name == show_name) {
		    return showObj;
		}
	    }
	}
	return null;
    }
    getShowById(show_id) {
	for (var showWeek of this.dg_shows) {
	    for(var showObj of showWeek) {
		if (showObj.show_id == show_id) {
		    return showObj;
		}
	    }
	}
	for (var showWeek of this.fm_shows) {
	    for(var showObj of showWeek) {
		if (showObj.id == show_id) {
		    return showObj;
		}
	    }
	}
	return null;
    }
    get dj_list() {
	return this._dj_list;
    }
    get dg_shows() {
	return this._dg_shows;
    }
    set dg_shows(dg_shows) {
	this._dg_shows = dg_shows;
    }
    get fm_shows() {
	return this._fm_shows;
    }
    set fm_shows(fm_shows) {
	this._fm_shows = fm_shows;
    }
    set sql_results(sql_results) {
	this._sql_results = sql_results;
    }
    get sql_results() {
	return this._sql_results;
    }
    /*
     * sql put methods used by express
     */
    deleteUser(user_name, delete_callback) {
	var delete_query = "delete from " + this.dbTables.users + " where name='" + user_name + "';";
	this.connection.query(delete_query, function(err, results, fields) {
	    if (results.affectedRows == 0) {
		delete_callback(false);
	    } else {
		delete_callback(true);
	    }
	});
    }
    deleteShow(show_id, showObj, delete_callback) {
	if (showObj != null) {
	    var shows;
	    if (showObj._show_channel == "fm") {
		shows = this.dbTables.fm_shows;
	    } else {
		shows = this.dbTables.dg_shows;
	    }
	    var delete_query = "delete from " + shows + " where id=" + show_id + ";";
	    this.connection.query(delete_query, function(err, results, fields) {
		if (results.affectedRows == 0) {
		    delete_callback(false);
		} else {
		    delete_callback(true);
		}
	    });
	} else {
	    delete_callback(false);
	}
    }
    putUser(user_name, user_pass, user_pic, user_bio, put_callback) {
	let myManager = this;
	var get_query = "select * from " + this.dbTables.users + " where name='" + user_name + "';";
	this.connection.query(get_query, function(err, results, fields) {
	    if (err) {
		put_callback(false, "internal server sql get query error");
	    } else {
		if (results.length != 0) {
		    put_callback(false, "insert error, user entry exists for primary key: " + user_name);
		} else {
		    var put_query = "insert into " + myManager.dbTables.users + " values('";
		    put_query += user_name + "', '" + user_pass + "', '" + user_pic + "', '" + user_bio + "');";
		    myManager.connection.query(put_query, function(put_err, put_results, put_fields) {
			if (put_err) {
			    put_callback(false, "interal server sql put query error");
			} else {
			    put_callback(true, "put success! added user primary key: " + user_name);
			}
		    });
		}
	    }
	});
    }
    putShow(show_name, show_description, show_genre, show_day, show_start, show_duration, channel, put_callback) {
	let myManager = this;
	var shows;
	if (channel == "fm") {
	    shows = this.dbTables.fm_shows;
	} else {
	    shows = this.dbTables.dg_shows;
	}
	var start_query = "select * from " + shows + " where day=" + show_day + " and start_hour=" + show_start + ";";
	this.connection.query(start_query, function(err, results, fields) {
	    if (err) {
		put_callback(false, "internal server sql get query error for start_hour and day")
	    } else {
		if (results.length != 0) {
		    put_callback(false, "insert error, show entry exists for same start hour: " + show_start);
		} else {
		    var id_query = "select max(id) as id from (select id from " + myManager.dbTables.fm_shows + " union select id from " + myManager.dbTables.dg_shows + ") a;";
		    myManager.connection.query(id_query, function(id_err, id_results, id_fields) {
			if (id_err) {
			    put_callback(false, "interal server sql get query error for id");
			} else {
			    var show_id = id_results[0].id + 1;
			    var put_query = "insert into " + shows + " values('";
			    put_query += show_name + "', '" + show_description + "', '" + show_genre + "', ";
			    put_query += show_day + ", " + show_start + ", " + show_duration + ", " + show_id + ");";
			    myManager.connection.query(put_query, function(put_err, put_results, put_fields) {
				if (put_err) {
				    put_callback(false, "internal server sql put query error");
				} else {
				    put_callback(true, "put success! added show primary key: " + show_id);
				}
			    });
			}
		    });
		}
	    }
	});
    }
    /*
     * sql get methods used by express
     */
    getSpecificShowByName(show_name, get_callback) {
	let myManager = this;
	let showObj;
	var show_djs_query = "select * from " + this.dbTables.show_djs + " where show_name='" + show_name + "';";
	this.connection.query(show_djs_query, function(dj_err, dj_results, dj_fields) {
	    if (dj_err) {
		get_callback(dj_err);
	    } else {
		if (dj_results.length != 0) {
		    var fm_query = "select * from " + myManager.dbTables.fm_shows + " where name='" + show_name + "';";
		    myManager.connection.query(fm_query, function(fm_err, fm_results, fm_fields) {
			if (fm_err) {
			    get_callback(fm_err);
			} else {
			    if (fm_results.length != 0) {
				showObj = Show.sqlToObj(fm_results[0], dj_results);
				showObj._show_channel = "fm";
				get_callback(showObj);
			    } else {
				var dg_query = "select * from " + myManager.dbTables.dg_shows + " where name='" + show_name + "';";
				myManager.connection.query(dg_query, function(dg_err, dg_results, dg_fields) {
				    if (dg_err) {
					get_callback(dg_err);
				    } else {
					showObj = Show.sqlToObj(dg_results[0], dj_results);
					showObj._show_channel = "dg";
					get_callback(showObj);
				    }
				});
			    }
			}
		    });
		} else {
		    get_callback(null);
		}
	    }
	});
    }
    getSpecificShowById(show_id, get_callback) {
	let myManager = this;
	let showObj;
	var show_djs_query = "select * from " + this.dbTables.show_djs + " where show_id=" + show_id + ";";
	this.connection.query(show_djs_query, function(dj_err, dj_results, dj_fields) {
	    if (dj_err) {
		get_callback(dj_err);
	    } else {
		var fm_query = "select * from " + myManager.dbTables.fm_shows + " where id=" + show_id + ";";
		myManager.connection.query(fm_query, function(fm_err, fm_results, fm_fields) {
		    if (fm_err) {
			get_callback(fm_err);
		    } else {
			if (fm_results.length != 0) {
			    showObj = Show.sqlToObj(fm_results[0], dj_results);
			    showObj._show_channel = "fm";
			    get_callback(showObj);
			} else {
			    var dg_query = "select * from " + myManager.dbTables.dg_shows + " where id=" + show_id + ";";
			    myManager.connection.query(dg_query, function(dg_err, dg_results, dg_fields) {
				if (dg_err) {
				    get_callback(dg_err);
				} else {
				    if (dg_results.length != 0) {
					showObj = Show.sqlToObj(dg_results[0], dj_results);
					showObj._show_channel = "dg";
					get_callback(showObj);
				    } else {
					get_callback(null);
				    }
				}
			    });
			}
		    }
		});
	    }
	});
    }
    getCurrentShowsSQL(show_day, show_start_hour, get_callback) {
      let myManager = this;
      let fmShowObj;
      let dgShowObj;
      var fm_query = "select * from " + this.dbTables.fm_shows + " where day="+show_day + " and where start_hour=" + show_start_hour + ";";
      var dg_query = "select * from " + this.dbTables.dg_shows + " where day="+show_day + " and where start_hour=" + show_start_hour + ";";
      this.connection.query(fm_query, function(fm_err, fm_results, fm_fields) {
        if (fm_err || fm_results.length == 0) {
          fmShowObj = null;
        } else {
          var fm_djs_query = "select * from " + myManager.dbTables.show_djs + " where id=" + fm_results[0].id + ";";
          this.connection.query(fm_djs_query, function(fm_dj_err, fm_dj_results, fm_dj_fields) {
            fmShowObj = Show.sqlToObj(fm_results, fm_dj_results);
            this.connection.query(dg_query, function(dg_err, dg_results, dg_fields) {
              if (dg_err || dg_results.length == 0) {
                dgShowObj = null;
              } else {
                var dg_djs_query = "select * from " + myManager.dbTables.show_djs + " where id=" + dg_results[0].id + ";";
                this.connection.query(dg_djs_query, function(dg_dj_err, dg_dj_results, dg_dj_fields) {
                    dgShowObj = Show.sqlToObj(dg_results, dg_dj_results);
                    get_callback(fmShowObj, dgShowObj);
                });
              }
            });
          });
        }
      });
    }
    getAllShowsSQL(channel, get_callback) {
	let myManager = this;
	var shows;
	(channel == "fm") ? shows = this.dbTables.fm_shows : shows = this.dbTables.dg_shows;
	var shows_query = "select * from " + shows + ";";
	this.connection.query(shows_query, function(err, results, fields) {
	    if (err) {
		get_callback(null);
	    } else {
		var show_djs_query = "select show_name,dj_name from " + myManager.dbTables.show_djs + ";";
		let showArray = new Array();
		results.map(result => showArray.push(Show.sqlToObj(result)));
		myManager.connection.query(show_djs_query, function(djs_err, dj_results, dj_fields) {
		    if (djs_err) {
			get_callback(showArray);
		    } else {
			let showObj;
			dj_results.map(function(dj_result) {
			    showObj = DjScheduleManager.showListGetShow(dj_result.show_name, showArray);
			    if (showObj != null) showObj.addDJ(dj_result.dj_name);
			});
			get_callback(showArray);
		    }
		});
	    }
	});
    }
    getSpecificDjShowsSQL(user_name, get_callback) {
	var show_djs_query = "select show_name from " + this.dbTables.show_djs + " where dj_name='" + user_name + "';";
	this.connection.query(show_djs_query, function(err, results, fields) {
	    if (err) {
		get_callback(null)
	    } else {
		get_callback(results);
	    }
	});
    }
    getAllUsersSQL(get_callback) {
	var users_query = "select * from " + this.dbTables.users + ";";
	let myManager = this;
	this.connection.query(users_query, function(err, results, fields) {
	    if (err) {
		get_callback(null);
	    } else {
		var show_djs_query = "select show_name,dj_name from " + myManager.dbTables.show_djs + ";";
		let userArray = new Array();
		results.map(result => userArray.push(DJ.sqlToObj(result)));
		myManager.connection.query(show_djs_query, function(shows_err, show_results, show_fields) {
		    if (shows_err) {
			get_callback(userArray);
		    } else {
			show_results.map(function(show_result) {
			    DjScheduleManager.djListGetDJ(show_result.dj_name, userArray).addShow(show_result.show_name);
			});
			get_callback(userArray);
		    }
		});
	    }
	});
    }
    getSpecificUserSQL(user_name, get_callback) {
	let myManager = this;
	var user_query = "select * from " + this.dbTables.users + " where name='" + user_name + "';";
	var shows_query = "select show_name from " + this.dbTables.show_djs + " where dj_name='" + user_name + "';";
	this.connection.query(user_query, function(err, results, fields) {
	    if (err) {
		get_callback(null);
	    } else {
		if (results.length != 0) {
		    myManager.connection.query(shows_query, function(show_err, show_results, show_fields) {
			if (show_err) { //there really shouldnt be an error here
			    get_callback(DJ.sqlToObj(results[0], null));
			} else {
			    get_callback(DJ.sqlToObj(results[0], show_results));
			}
		    });
		} else {
		    get_callback(null);
		}
	    }
	});
    }
    /*
     * sql methods used internally by manager
     */
    closeSQL() {
	this.connection.end();
	console.log("successfuly closed sql connection");
    }
    getDjShowSQL(showObj, djObj, callback) {
	var show_djs_query = "select * from " + this.dbTables.show_djs + " where ";
	show_djs_query += "dj_name='" + djObj.user_name + "' and show_id=" + showObj.show_id + ";";
	this.connection.query(show_djs_query, function(err, results, fields) {
	    if (err) {
		callback(err, null, showObj, djObj);
	    } else {
		callback(null, results, showObj, djObj);
	    }
	});
    }
    getShowSQL(showObj, channel, callback) {
	var shows;
	if (channel == "fm" ) {
	    shows = this.dbTables.fm_shows;
	} else {
	    shows = this.dbTables.dg_shows;
	}
	var show_query = "select * from " + shows + " where id=" + showObj.show_id;
	this.connection.query(show_query, function(err, results, fields) {
	    if (err) {
		callback(err, null, showObj);
	    } else {
		callback(null, results, showObj);
	    }
	});
    }
    getUserSQL(userObj, callback) {
	var user_query = "select * from " + this.dbTables.users + " where name='" + userObj.user_name + "';";
	this.connection.query(user_query, function(err, results, fields) {
	    if (err) {
		callback(err, null, userObj);
	    } else {
		callback(null, results, userObj);
	    }
	});
    }
    putDjShowSQL(showObj, djObj, callback) {
	var show_djs_query = "insert into " + this.dbTables.show_djs + " values(";
	show_djs_query += showObj.show_id + ", '"  + showObj.show_name + "', '" + djObj.user_name + "');";
	this.connection.query(show_djs_query, function(err, results) {
	    if (err) {
		callback(err, null);
	    } else {
		callback(null, results);
	    }
	});
    }
    putShowSQL(showObj, channel, callback) {
	var shows;
	if (channel == "fm") {
	    shows = this.dbTables.fm_shows;
	} else {
	    shows = this.dbTables.dg_shows;
	}
	var show_query = "insert into " + shows + " values('" + showObj.show_name + "', '";
	show_query += showObj.show_description + "', '" + showObj.show_genre + "', '" + showObj.show_day + "', '";
	show_query += showObj.show_start_hour + "', '" + showObj.show_duration + "', '" + showObj.show_id + "');";
	this.connection.query(show_query, function(err, results, fields) {
	    if (err) {
		callback(err, null);
	    } else {
		callback(null, results);
	    }
	});
    }
    putUserSQL(userObj, callback) {
	var user_query = "insert into " + this.dbTables.users + " values('";
	user_query += userObj.user_name + "', '" + userObj.user_pass + "', '";
	user_query += userObj.user_pic + "', '" + userObj.user_bio + "');";
	this.connection.query(user_query, function(err, results, fields) {
	    if (err) {
		callback(err, null);
	    } else {
		callback(null, results);
	    }
	});
    }
    /*
     * update methods used by manager object and express server
     */
    updShowSQL(showObj, channel, change_name=true, change_description=true, change_genre=true, change_day=true,
	       change_start_hour=true, change_duration=true, callback) {
	var shows;
	if (channel == "fm" ) {
	    shows = this.dbTables.fm_shows;
	} else {
	    shows = this.dbTables.dg_shows;
	}
	var show_query = "update " + shows + " SET ";
	if (!change_name) show_query += "name = '" + showObj.show_name + "'";
	if (!change_description) {
	    if (!change_name) show_query += ", ";
	    show_query += "description = '" + showObj.show_description + "'";
	}
	if (!change_genre) {
	    if (!change_name || !change_description) show_query += ", ";
	    show_query += "genre = '" + showObj.show_genre + "'";
	}
	if (!change_day) {
	    if (!change_name || !change_description || !change_genre) show_query += ", ";
	    show_query += "day = " + showObj.show_day;
	}
	if (!change_start_hour) {
	    if (!change_name || !change_description || !change_genre || !change_day) show_query += ", ";
	    show_query += "start_hour = " + showObj.show_start_hour;
	}
	if (!change_duration) {
	    if (!change_name || !change_description || !change_genre ||
		!change_day || !change_start_hour) show_query += ", ";
	    show_query += "duration = " + showObj.show_duration;
	}
	show_query += " where id=" + showObj.show_id + ";";
	if (!change_name || !change_description || !change_genre ||
	    !change_day || !change_start_hour || !change_duration) {
	    this.connection.query(show_query, function(err, results, fields) {
		if (err) {
		    callback(err, false);
		} else {
		    callback(null, true);
		}
	    });
	} else {
	    callback(null, false);
	}
    }
    updUserSQL(userObj, change_pass=true, change_pic=true, change_bio=true, callback) {
	var user_query = "update " + this.dbTables.users + " SET ";
	if (!change_pass) user_query += "pass = '" + userObj.user_pass + "'";
	if (!change_pic) {
	    if (!change_pass) user_query += ", ";
	    user_query += "pic = '" + userObj.user_pic + "'";
	}
	if (!change_bio) {
	    if (!change_pass || !change_pic) user_query += ", ";
	    user_query += "bio = '" + userObj.user_bio + "'";
	}
	user_query += " WHERE name='" + userObj.user_name + "';";
	if (!change_pass || !change_pic || !change_bio) {
	    this.connection.query(user_query, function(err, results, fields) {
		if (err) {
		    callback(err, false);
		} else {
		    callback(null, true);
		}
	    });
	} else {
	    callback(null, false);
	}
    }
    updateSQL() {
	let myManager = this;
	this.connection.connect(function(err) {
	    if (err) throw err;
	    for (var userObj of myManager.dj_list) {
		myManager.getUserSQL(userObj, function(err, results, userObj) {
		    if (err) {
			throw err;
		    } else {
			if (results.length != 0) { //user was found just update necessary columns
			    myManager.updUserSQL(userObj,
						 userObj.user_pass == results[0].pass,
						 userObj.user_pic == results[0].pic,
						 userObj.user_bio == results[0].bio, function(err, results) {
						     if (err) {
							 throw err;
						     } else {
							 if (results) console.log("Updated User: " + userObj)
						     }
						 });
			} else { //user not found, must be inserted into table
			    myManager.putUserSQL(userObj, function(err, results) {
				if (err) {
				    throw err;
				} else {
				    console.log("Added user: " + userObj);
				}
			    });
			}
		    }
		});
	    }
	    for (var dgShowWeek of myManager.dg_shows) {
		for (var dgShowObj of dgShowWeek) {
		    myManager.getShowSQL(dgShowObj, "dg", function(err, results, dgShowObj) {
			if (err) {
			    throw err;
			} else {
			    if (results.length != 0) {
				myManager.updShowSQL(dgShowObj, "dg",
						     dgShowObj.show_name == results[0].name,
						     dgShowObj.show_description == results[0].description,
						     dgShowObj.show_genre == results[0].genre,
						     dgShowObj.show_day == results[0].day,
						     dgShowObj.show_start_hour == results[0].start_hour,
						     dgShowObj.show_duration == results[0].duration,
						     function(err, results) {
							 if (err) {
							     throw err
							 } else {
							     if (results) console.log("Updated show: " + dgShowObj);
							 }
						     });
			    } else {
				myManager.putShowSQL(dgShowObj, "dg", function(err, results) {
				    if (err) {
					throw err;
				    } else {
					console.log("Added show: " + dgShowObj);
				    }
				});
			    }
			}
		    });
		    for (var djObj of dgShowObj.show_djs) {
			myManager.getDjShowSQL(dgShowObj, djObj, function(err, results, dgShowObj, djObj) {
			    if (err) {
				throw err;
			    } else {
				if (results.length != 0) {
				    //not sure if we need to update found entries if IDs dont change
				} else {
				    myManager.putDjShowSQL(dgShowObj, djObj, function(err, results) {
					if (err) {
					    throw err;
					} else {
					    console.log("Added (Show,Dj): (" + dgShowObj + "," + djObj + ")");
					}
				    });
				}
			    }
			});
		    }
		}
	    }
	    for (var fmShowWeek of myManager.fm_shows) {
		for (var fmShowObj of fmShowWeek) {
		    myManager.getShowSQL(fmShowObj, "fm", function(err, results, fmShowObj) {
			if (err) {
			    throw err;
			} else {
			    if (results.length != 0) {
				myManager.updShowSQL(fmShowObj, "fm",
						     (fmShowObj.show_name == results[0].name),
						     (fmShowObj.show_description == results[0].description),
						     (fmShowObj.show_genre == results[0].genre),
						     (fmShowObj.show_day == results[0].day),
						     (fmShowObj.show_start_hour == results[0].start_hour),
						     (fmShowObj.show_duration == results[0].duration),
						     function(err, results) {
							 if (err) {
							     throw err
							 } else {
							     if (results) console.log("Updated show: " + fmShowObj);
							 }
						     });
			    } else {
				myManager.putShowSQL(fmShowObj, "fm", function(err, results) {
				    if (err) {
					throw err;
				    } else {
					console.log("Added show: " + fmShowObj);
				    }
				});
			    }
			}
		    });
		    for (var djObj of fmShowObj.show_djs) {
			myManager.getDjShowSQL(fmShowObj, djObj, function(err, results, fmShowObj, djObj) {
			    if (err) {
				throw err;
			    } else {
				if (results.length != 0) {
				    //not sure if we need to update found entries if IDs dont change
				} else {
				    myManager.putDjShowSQL(fmShowObj, djObj, function(err, results) {
					if (err) {
					    throw err;
					} else {
					    console.log("Added (Show,Dj): (" + fmShowObj + "," + djObj + ")");
					}
				    });
				}
			    }
			});
		    }
		}
	    }
	});
    }
    /*
     * static helper functions
     */
    static showListGetShow(show_name, show_list) {
	for (var showObj of show_list) {
	    if (showObj.show_name == show_name) {
		return showObj;
	    }
	}
	return null;
    }
    static djListGetDJ(dj_name, dj_list) {
	for (var djObj of dj_list) {
	    if (djObj.user_name == dj_name) {
		return djObj;
	    }
	}
	return null;
    }
    static djListIncludes(dj_name, dj_list) {
	for (var djObj of dj_list) {
	    if (djObj.user_name == dj_name) {
		return true;
	    }
	}
	return false;
    }
    static jsonToObjHelper(json_array, dj_list, show_list) {
	var day_count = 0;
	json_array.map(function(day) {
	    day.map(function(show) {
		if (show.show_id != 0) {
		    let djObj;
		    let show_dj_list = new Array();
		    for (var dj_name of show['dj']) {
			/*
                         * passwords are just the djs name for now
                         * user_pics are urls to placeholder images
                         * show_array for djs is array of show_names
                         */
			djObj = new DJ(dj_name, dj_name);
			djObj.addShow(show.name);
			show_dj_list.push(djObj);
			/* then union current dj list with specific dj, i.e. remove duplicates */
			if (!DjScheduleManager.djListIncludes(dj_name, dj_list)) {
			    dj_list.push(djObj);
			} else { //dj already exists already so must add another show_name to dj Object show array
			    DjScheduleManager.djListGetDJ(dj_name, dj_list).addShow(show.name);
			}
		    }
		    show_list[day_count].push(new Show(show.name,
						      show_dj_list,
						      show.description,
						      show.genres,
						      day_count,
						      show.start_hour,
						      show.duration,
						      show.show_id
						     ));
		}
	    });
	    day_count++;
	});
    }
    static jsonToObj(schedule_json, dj_list, dg_shows, fm_shows) {
	DjScheduleManager.jsonToObjHelper(schedule_json['fm'], dj_list, fm_shows);
	DjScheduleManager.jsonToObjHelper(schedule_json['digital'], dj_list, dg_shows);
    }
}
