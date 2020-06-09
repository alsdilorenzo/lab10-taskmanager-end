'use strict'

const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('./db/tasks.db', (err) => {
    if (err) {
        console.error(err.message)
        throw err
    }
})


module.exports = db;