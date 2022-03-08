const sqlite3 = require('sqlite3').verbose(); // imports sqlite library

let db = new sqlite3.Database('../database/transactions.sqlite3', (err) => {
    //db stores the database connection
    if (err) {
        console.log('code err ' + err.message);
        throw err
    } else {
        console.log('connected to sqlite3 database');
    }
});

module.exports = db; // allows the database connection to be used in other files


