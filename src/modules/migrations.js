"use strict";

const mysql = require("mysql");

var db;

function connectToDB() {
    require("dotenv").config();

    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

function showTables() {
    return new Promise((resolve, reject) => {
        connectToDB();
    
        db.connect(err => {
            if(err)reject(err);
            db.query("SHOW TABLES", (err, res) => {
                if (err)reject(err);
                if (res.length == 0)return resolve([""]);
                resolve(res[0].Tables_in_nodejs_repbot.split(" "));
            });
        });
    });
}

/**
 * Creates a table in SQL in the selected database
 * 
 * @param {string} name Name of table
 * @param {object} fields Table fields
 */
async function createTable(name, fields) {
    return new Promise(async (resolve, reject) => {
        var tables;
        await showTables().then(result => tables = result).catch(console.error);
    
        if(tables.indexOf(name) >= 0)reject("TABLE ALREADY EXISTS");
    
        if (typeof fields != "object")reject("FIELDS PARAMETER MUST BE TYPE OF OBJECT");
    
        if(db.state === 'disconnected'){
            db.connect(err => {
                if(err)reject(err);
            });
        }
            
        let query = `CREATE TABLE ${name} (`;
    
        let fieldNames = Object.keys(fields);
        fieldNames.forEach((val, i) => {
            query += val + " " + fields[val];
            query += i < fieldNames.length - 1 ? "," : ");";
        });

        db.query(query, (err, res) => {
            if(err)reject(err)
            resolve(true);
        });
    });
}

async function checkMigrated() {
    let tables = [];

    var files;

    var normalizedPath = require("path").join(__dirname, "../database/migrations");
    await require("fs").promises.readdir(normalizedPath).then(res => files = res).catch(console.error);

    files.forEach(async file => {
        tables.push(require("../database/migrations/" + file).table_name);
    });

    let table_b;
    await require("../database/database").showTables().then(res => table_b = res).catch(console.error);

    return arraysEqual(tables, table_b);
}

// Stackoverflow COPYPASTA TYSM
function arraysEqual(x, y) {
    let a = x, b = y;

    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    a.sort();
    b.sort();

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

exports.checkMigrated = checkMigrated;
exports.createTable = createTable;