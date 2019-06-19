
const Model = require('./Model.js');
const schedule_json = require('./schedule_data.js').schedule;
const db_header = require('../database/header.js'); 

let mySch = new Model.DjScheduleManager(schedule_json, db_header.dbInfo, db_header.dbTables, true, true);
mySch.updateSQL();
/*
for (var week of mySch.fm_shows) {
    for (var show of week) {
	console.log(show);
    }
}
*/
