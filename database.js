import mysql from "mysql"

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'employee_database',
    user: 'root',
    password: '123456'
});
export default connection;