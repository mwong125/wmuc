
const User = require('./User.js');

module.exports = class DJ extends User {
    constructor(user_name,
		user_pass,
		user_pic="https://via.placeholder.com/150",
		user_bio="cool words",
		user_shows=new Array()) {
	super(user_name, user_pass);
	this._user_pic = user_pic;
	this._user_bio = user_bio
	this._user_shows = user_shows;
    }
    toString() {
	let str =  "(Username,Userpass,Shows:[]): ("+this._user_name+","+this._user_pass;
	this.user_shows.map(show => str += ","+show.toString());
	return str + ")";
    }
    get user_pic() {
	return this._user_pic;
    }
    set user_pic(user_pic) {
	this._user_pic = user_pic;
    }
    get user_bio() {
	return this._user_bio;
    }
    set user_bio(user_bio) {
	this._user_bio = user_bio;
    }
    get user_shows() {
	return this._user_shows;
    }
    set user_shows(user_shows) {
	this._user_shows = user_shows;
    }
    addShow(show) {
	this._user_shows.push(show);
	return this;
    }
    delShow(show_name) {
	let index  = 0;
	for (var show of this._user_shows) {
	    if (show._show_name == show_name) {
		break;
	    }
	    index++;
	}
	if (index != this._user_shows.length) {
	    this._user_shows.splice(index, 1);
	}
	return this;
    }
    static sqlToObj(sql_results, sql_show_results) {
	let djObj = new DJ(sql_results.name, sql_results.pass, sql_results.pic, sql_results.bio);
	if (sql_show_results != null) {
	    sql_show_results.map(show_result => djObj.addShow(show_result.show_name));
	}
	return djObj;
    }
};
