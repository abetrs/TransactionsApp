const express = require('express');
const db = require('./database');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let port = 8000;

app.listen(port, () => console.log('Running server on ' + port));
// test if server works
app.get('/', (req, res, next) => {
    console.log(req.headers);
    res.json({
        "message": "OK"
    })
});

// GET ALL
app.get('/api/customers', (req, res, next) => {
    let resData = 'SELECT * FROM customers';
    let params = [];
    // selects all rows in a table
    db.all(resData, params, (err, rows) => {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.status(200).json({
            "message": "success",
            "data": rows,
            "cookie": "yum"
        });
    });
});
// GET SINGLE
app.get('/api/customers/:id', (req, res, next) => {
    let params = [req.params.id];
    let resData = "SELECT * from customers where id = ?";
    db.get(resData, params, (err, row) => {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
})

// POST SINGLE
app.post('/api/customers', (req, res, next) => {
    let errors = [];

    if (!req.body.first_name) {
        errors.push('No first name provided');
    } else if (!req.body.last_name) {
        errors.push('No last name provided');
    }

    if (errors.length > 0) {
        res.status(400).json({
            "error": errors.join(',')
        });
        return;
    }
    let reqData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        quota: req.body.quota
    } 
    let params = [req.body.first_name, req.body.last_name, req.body.quota];
    db.run("INSERT INTO customers (first_name, last_name, quota) VALUES(?,?,?)", params, function(err, result) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": reqData,
            "id": this.lastID
        })
    });
});

// UPDATE SINGLE
app.patch('/api/customers/:id', (req, res, next) => {
    let reqData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        quota: req.body.quota
    };
    db.run(`UPDATE customers set 
            first_name = COALESCE(?,first_name),
            last_name = COALESCE(?,last_name),
            quota = COALESCE(?,quota)
            WHERE id = ?`,
        [reqData.first_name, reqData.last_name, reqData.quota, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({
                    "error": err.message
                });
                return;
            }
            res.json({
                message: "success",
                data: reqData,
                changes: this.changes
            });
        });
});
//DELETE
app.delete("/api/customers/:id", (req, res, next) => {
    db.run(`DELETE FROM customers WHERE id = ?`, req.params.id, function (err, result) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "deleted",
            "changes": this.changes
        })
    })
});

app.use((req, res) => {
    res.status(404)
});

