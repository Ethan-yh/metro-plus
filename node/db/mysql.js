const mysql = require('mysql');

const mysql = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'yh123456',
  database : 'test',
  insecureAuth : true
});
 
// connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

module.exports = mysql;