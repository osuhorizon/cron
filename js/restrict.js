const mysql = require('mysql');

const time = Math.round(new Date().getTime()/1000)

const config = require("../config.json");

const last = time - (((60*60)*24)*config.inactive)

const con = mysql.createConnection({

    multipleStatements: true,

    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database

});


con.connect(function(err) {
    if (err) throw err;
    var sql = `UPDATE users SET achievements_version = '9' WHERE latest_activity < '${last}' AND privileges >= '3' AND id != '999' ; UPDATE users SET privileges = '2' WHERE achievements_version = '9'`
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(`Inactive user edited that were offline for over ${config.inactive} days.`);
      process.exit(1)
    });
  });
