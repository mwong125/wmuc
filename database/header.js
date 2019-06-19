
const dbInfo = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "wmuc",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
}

const dbTables = {
    users: "users",
    dg_shows: "dg_shows",
    fm_shows: "fm_shows",
    show_djs: "show_djs"
}

module.exports = {
    dbInfo: dbInfo,
    dbTables: dbTables
};
