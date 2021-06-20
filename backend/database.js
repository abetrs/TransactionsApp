const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database/transactions.sqlite3', (err) => {
    if (err) {
        
        console.log('code err ' + err.message);
        throw err
    } else {
        console.log('connected to sqlite3 database');
    }
});

module.exports = db;