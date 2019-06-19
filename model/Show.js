module.exports = class Show {
    constructor(show_name,
		show_djs,
		show_description,
		show_genre,
		show_day,
		show_start_hour,
		show_duration,
		show_id
	       ) {
	this._show_name = show_name;
	this._show_djs = new Array();
	if (show_djs != null) show_djs.map(dj => this._show_djs.push(dj));
	this._show_description = show_description;
	this._show_genre = show_genre;
	this._show_day = show_day;
	this._show_start_hour = show_start_hour;
	this._show_duration = show_duration;
	this._show_id = show_id;
    }
    toString() {
	return this._show_name+"-"+this._show_id+"-"+this._show_description;
    }
    get show_name() {
	return this._show_name;
    }
    set show_name(show_name) {
	this._show_name = show_name;
    }
    get show_djs() {
	return this._show_djs;
    }
    set show_djs(show_djs) {
	this._show_djs = show_djs;
    }
    get show_description() {
	return this._show_description;
    }
    set show_description(show_description) {
	this._show_description = show_description;
    }
    get show_genre() {
	return this._show_genre;
    }
    set show_genre(show_genre) {
	this._show_genre = show_genre;
    }
    get show_day() {
	return this._show_day;
    }
    set show_day(show_day) {
	this._show_day = show_day;
    }
    get show_start_hour() {
	return this._show_start_hour;
    }
    set show_start_hour(show_start_hour) {
	this._show_start_hour = show_start_hour;
    }
    get show_duration() {
	return this._show_duration;
    }
    set show_duration(show_duration) {
	this._show_duration = show_duration;
    }
    get show_id() {
	return this._show_id;
    }
    set show_id(show_id) {
	this._show_id = show_id;
    }
    addDJ(dj) {
	this._show_djs.push(dj);
    }
    static sqlToObj(sql_results, sql_dj_results) {
	let showObj = new Show(sql_results.name,
			       new Array(),
			       sql_results.description,
			       sql_results.genre,
			       sql_results.day,
			       sql_results.start_hour,
			       sql_results.duration,
			       sql_results.id);
	if (sql_dj_results != null) {
	    sql_dj_results.map(result => showObj.addDJ(result.dj_name));
	}
	return showObj;
    }
}

