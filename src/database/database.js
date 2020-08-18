"use strict";

const mysql = require("mysql");

require("dotenv").config();

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function init() {
    require("./migrations/create_currency_table").create();
}

function query(query) {
    
    var rt;
    db.connect(err => {
        if (err)throw err;
        db.query(query, (err, res) => {
            if (err)throw err;
            rt = res;
        });
    });
    return "Result: " + rt;
}


exports.init = init;
exports.query = query;