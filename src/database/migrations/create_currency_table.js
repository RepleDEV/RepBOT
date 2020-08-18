"use strict";

const mysql = require("mysql");

require("dotenv").config();

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

let query = "CREATE TABLE currency (id INT AUTO_INCREMENT PRIMARY KEY, user_id varchar(255), value BIGINT)";

function create() {
    db.connect(err => {
        if (err)throw err;
        db.query(query, err => {
            if (err)throw err;
        });
    }); 
}

exports.create = create;