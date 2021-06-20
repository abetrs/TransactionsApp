const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database/transactions.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});


let dummy = {
    first_name: 'Abe',
    last_name: 'The Unicorn',
    quota: 2
}

// db.serialize(()=>{
//     db.run(
//         'INSERT INTO customers(first_name, last_name, quota) VALUES(?,?,?)', [dummy.first_name, dummy.last_name, dummy.quota],
//         function (err) {
//             if (err) {
//             return console.log(err.message);
//             }
//             console.log("New customer has been added");
//         }
//     );
// });

module.exports = db;
