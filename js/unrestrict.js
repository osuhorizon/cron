const mysql = require('mysql');

const time = Math.round(new Date().getTime()/1000)

const config = require("../config.json");

const con = mysql.createConnection({

  multipleStatements: true,

  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database

});

con.connect(function(err) {
    if (err) throw err;
    var sql = `UPDATE users SET privileges = '3' WHERE achievements_version = '9' ; UPDATE users SET achievements_version = '6' WHERE achievements_version = '9'`
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(result.affectedRows + " user unrestricted");
      process.exit(1)
    });
  });