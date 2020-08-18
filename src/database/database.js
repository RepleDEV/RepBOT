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
    
        if(db.state === 'disconnected'){
            db.connect(err => {
                if(err)reject(err);
            });
        }

        db.query("SHOW TABLES", (err, res) => {
            if (err)reject(err);
            if (res.length == 0)return resolve([""]);
            resolve(res[0].Tables_in_nodejs_repbot.split(" "));
        });
    });
}

/**
 * Initiates a query to the database
 * 
 * @param {string} query Query to initiate
 */
function query(query) {
    return new Promise((resolve, reject) => {
        connectToDB();
        
        if(db.state === 'disconnected'){
            db.connect(err => {
                if(err)reject(err);
            });
        }

        db.query(query, (err, res) => {
            if (err)reject(err);
            resolve(res);
        });
    });
}

var normalizedPath = require("path").join(__dirname, "migrations");

async function migrate_all() {
    var dirs;
    await require("fs").promises.readdir(normalizedPath).then(res => dirs = res).catch(console.error);

    return new Promise((resolve, reject) => {
        dirs.forEach(async file => {
            try {
                await require("./migrations/" + file).create();
            } catch (err) {
                reject(err);
            }
        });
        resolve(true);
    });
}

exports.migrate = migrate_all;
exports.showTables = showTables;
exports.query = query;