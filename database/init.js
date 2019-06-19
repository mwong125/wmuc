
/*
  initializes the database
*/

/*required node plugin and personal header for db info */
var header = require('./header.js');
var mysql = require('mysql');

/*grab database name and delete field from info before creating database
  so it doesnt try to connect to wmuc database that isnt there yet
*/
var dbInfo = header.dbInfo;
var db_name = dbInfo.database;
delete dbInfo.database;

var dbTables = header.dbTables;

/* connects to localhost sql server using username:password -> root:root */
var connection = mysql.createConnection(dbInfo);
console.log("Connected to local sql server: @" + dbInfo.host + "\nCreating database: " + db_name);
connection.connect(function(err) {
    if (err) throw err;
    let db_query = "create database " + db_name;
    /* create database wmuc and catch creation error
       all other queries are dependent on this being successful
       so all table creatin queries are nested under the error throw
     */
    connection.query(db_query, function (err, result) {
	if (err) throw err;
	console.log("Successfuly created db");
	console.log("Creating tables in wmuc: ");
	console.log(" -users: name primary key, pass, pic, bio")
	console.log(" -dg_shows: name, description, genre, day, start_hour, duration, id primary key");
	console.log(" -fm_shows: name, description, genre, day, start_hour, duration, id primary key");
	console.log(" -show_dj: show_id, show_name, dj_name, primary key(show_id, dj_name");
	let table_query0 = "use " + db_name + "; ";
	/* all the table creations are independent so
	   if one fails it will not affect the other, dont
	   need to nest, 'use wmuc' query should never fail
	 */
	let table_query1 = "create table users(name varchar(50) primary key, pass varchar(50), pic varchar(5000), bio varchar(50)); ";
	let table_query2 = "create table dg_shows(name varchar(50), description varchar(250), genre varchar(50), day int, start_hour float, duration float, id int primary key not null); "
	let table_query3 = "create table fm_shows(name varchar(50), description varchar(250), genre varchar(50), day int, start_hour float, duration float, id int primary key not null); "
	let table_query4 = "create table show_djs(show_id int, show_name varchar(50), dj_name varchar(50), primary key(show_id, dj_name));"
	connection.query(table_query0);
	connection.query(table_query1, (err, result) => { if (err) throw err });
	connection.query(table_query2, (err, result) => { if (err) throw err });
	connection.query(table_query3, (err, result) => { if (err) throw err });
	connection.query(table_query4, (err, result) => { if (err) throw err });
	console.log("Successfully created all tables");
	connection.end();
    });
});
