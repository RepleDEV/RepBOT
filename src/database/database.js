"use strict";

var normalizedPath = require("path").join(__dirname, "migrations");

async function migrate() {
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

exports.migrate = migrate;