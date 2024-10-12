const mysql = require("mysql");
require("dotenv").config();

const sql = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

sql.connect((err) =>{
    if(!err){
        console.log("Connected to MySQL Database");
    }else{
        console.log("Error connecting to MySQL Database:\n", err);
    }
})

module.exports = sql;