module.exports = class User {
    constructor(user_name, user_pass, user_pic) {
	this._user_name = user_name;
	this._user_pass = user_pass;
    }
    toString() {
	return "(Username,Userpass): ("+this._user_name+","+this._user_pass+")";
    }
    get user_name() {
	return this._user_name;
    }
    set user_name(user_name) {
	this._user_name = user_name;
    }
    get user_pass() {
	return this._user_pass;
    }
    set user_pass(user_pass) {
	this._user_pass = user_pass;
    }
};

