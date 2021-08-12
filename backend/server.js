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

// Clients 
// GET ALL
app.get('/api/clients', (req, res, next) => {
    let resData = 'SELECT * FROM clients';
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
app.get('/api/clients/:id', (req, res, next) => {
    let params = [req.params.id];
    let resData = "SELECT * from clients where id = ?";
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
app.post('/api/clients', (req, res, next) => {
    let errors = [];

    if ((req.body.cliFirstName == null) ||
        (req.body.cliLastName == null) ||
        (req.body.cliPhone == null) ||
        (req.body.cliEmail == null) ||
        (req.body.cliAddressStreet == null) ||
        (req.body.cliAddressCity == null) ||
        (req.body.cliAddressPCode == null) ||
        (req.body.cliAddressCity == null) ||
        (req.body.cliQuotaLeft == null))
    {
        errors.push("All parameters not provided");
    }

    if (errors.length > 0) {
        res.status(400).json({
            "error": errors.join(',')
        });
        return;
    }
    let reqData = {
        cliFirstName: req.body.cliFirstName,
        cliLastName: req.body.cliLastName,
        cliPhone: req.body.cliPhone,
        cliEmail: req.body.cliEmail,
        cliAddressStreet: req.body.cliAddressStreet,
        cliAddressPCode: req.body.cliAddressPCode,
        cliAddressCity: req.body.cliAddressCity,
        cliQuotaLeft: req.body.cliQuotaLeft
    } 
    let params = [req.body.cliFirstName, req.body.cliLastName, req.body.cliPhone, req.body.cliEmail, req.body.cliAddressStreet,
    req.body.cliAddressPCode, req.body.cliAddressCity, req.body.cliQuotaLeft];
    db.run(`INSERT INTO clients (cliFirstName, cliLastName, cliPhone, cliEmail, cliAddressStreet, cliAddressPCode, cliAddressCity, cliQuotaLeft) VALUES(?,?,?,?,?,?,?,?)`,
            params, function (err, result) {
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
app.patch('/api/clients/:id', (req, res, next) => {
    let reqData = {
        cliFirstName: req.body.cliFirstName,
        cliLastName: req.body.cliLastName,
        cliPhone: req.body.cliPhone,
        cliEmail: req.body.cliEmail,
        cliAddressStreet: req.body.cliAddressStreet,
        cliAddressPCode: req.body.cliAddressPCode,
        cliAddressCity: req.body.cliAddressCity,
        cliQuotaLeft: req.body.cliQuotaLeft
    };
    db.run(`UPDATE clients set 
            cliFirstName = COALESCE(?,cliFirstName),
            cliLastName = COALESCE(?,cliLastName),
            cliPhone = COALESCE(?,cliPhone),
            cliEmail = COALESCE(?,cliEmail),
            cliAddressStreet = COALESCE(?,cliAddressStreet),
            cliAddressPCode = COALESCE(?,cliAddressPCode),
            cliAddressCity = COALESCE(?,cliAddressCity),
            cliQuotaLeft = COALESCE(?,cliQuotaLeft)
            WHERE id = ?`,
        [reqData.cliFirstName, reqData.cliLastName, reqData.cliPhone, reqData.cliEmail, reqData.cliAddressStreet,
        reqData.cliAddressPCode, reqData.cliAddressCity, reqData.cliQuotaLeft, req.params.id],
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
app.delete("/api/clients/:id", (req, res, next) => {
    db.run(`DELETE FROM clients WHERE id = ?`, req.params.id, function (err, result) {
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

