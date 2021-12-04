// Libraries
const express = require('express');
const db = require('./database');
const app = express();
// Allows to parse data as json
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//sets por
let port = 8000;
// Server listening
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
    // Gets specific client
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
    let errors = []; // Stores potential errors
    // Checks for missing data
    if ((req.body.cliFirstName == null) ||
        (req.body.cliLastName == null) ||
        (req.body.cliPhone == null) ||
        (req.body.cliEmail == null) ||
        (req.body.cliAddressStreet == null) ||
        (req.body.cliAddressCity == null) ||
        (req.body.cliAddressPCode == null) ||
        (req.body.cliQuotaUsed == null) ||
        (req.body.cliQuota == null))
    {
        errors.push("All parameters not provided");
    }
    // Error-checking
    if (errors.length > 0) {
        res.status(400).json({
            "error": errors.join(',')
        });
        return;
    }
    // Data to store in database
    let reqData = {
        cliFirstName: req.body.cliFirstName,
        cliLastName: req.body.cliLastName,
        cliPhone: req.body.cliPhone,
        cliEmail: req.body.cliEmail,
        cliAddressStreet: req.body.cliAddressStreet,
        cliAddressPCode: req.body.cliAddressPCode,
        cliAddressCity: req.body.cliAddressCity,
        cliQuotaUsed: req.body.cliQuotaUsed,
        cliQuota: req.body.cliQuota,
        cliMoneyOwed: req.body.cliMoneyOwed
    }
    let params = [reqData.cliFirstName, reqData.cliLastName, reqData.cliPhone, reqData.cliEmail, reqData.cliAddressStreet,
        reqData.cliAddressPCode, reqData.cliAddressCity, reqData.cliQuotaUsed, reqData.cliQuota, reqData.cliMoneyOwed];
    // Adds data to database
    db.run(`INSERT INTO clients (cliFirstName, cliLastName, cliPhone, cliEmail, cliAddressStreet, cliAddressPCode, cliAddressCity, cliQuotaUsed, cliQuota, cliMoneyOwed) VALUES(?,?,?,?,?,?,?,?,?,?)`,
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
    // Stores data to send
    let reqData = {
        cliFirstName: req.body.cliFirstName,
        cliLastName: req.body.cliLastName,
        cliPhone: req.body.cliPhone,
        cliEmail: req.body.cliEmail,
        cliAddressStreet: req.body.cliAddressStreet,
        cliAddressPCode: req.body.cliAddressPCode,
        cliAddressCity: req.body.cliAddressCity,
        cliQuotaUsed: req.body.cliQuotaUsed,
        cliQuota: req.body.cliQuota,
        cliMoneyOwed: req.body.cliMoneyOwed
    };
    // Edits the data of the id that was set
    db.run(`UPDATE clients set 
            cliFirstName = COALESCE(?,cliFirstName),
            cliLastName = COALESCE(?,cliLastName),
            cliPhone = COALESCE(?,cliPhone),
            cliEmail = COALESCE(?,cliEmail),
            cliAddressStreet = COALESCE(?,cliAddressStreet),
            cliAddressPCode = COALESCE(?,cliAddressPCode),
            cliAddressCity = COALESCE(?,cliAddressCity),
            cliQuotaUsed = COALESCE(?,cliQuotaUsed),
            cliQuota = COALESCE(?,cliQuota),
            cliMoneyOwed = COALESCE(?,cliMoneyOwed)
            WHERE id = ?`,
        [reqData.cliFirstName, reqData.cliLastName, reqData.cliPhone, reqData.cliEmail, reqData.cliAddressStreet,
        reqData.cliAddressPCode, reqData.cliAddressCity, reqData.cliQuotaUsed, reqData.cliQuota, reqData.cliMoneyOwed, req.params.id],
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
    // Deletes data of a certain id
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









// Products 
// GET ALL
app.get('/api/products', (req, res, next) => {
    let resData = 'SELECT * FROM products';
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
app.get('/api/products/:id', (req, res, next) => {
    let params = [req.params.id];
    let resData = "SELECT * from products where id = ?";
    // Gets specific data row
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
app.post('/api/products', (req, res, next) => {
    let errors = [];
    // Checks for missing data
    if ((req.body.prodName == null) ||
        (req.body.prodType == null) ||
        (req.body.prodPrice == null) ||
        (req.body.prodQuantity == null))
    {
        errors.push("All parameters not provided");
    }
    // Error-checking
    if (errors.length > 0) {
        res.status(400).json({
            "error": errors.join(',')
        });
        return;
    }
    // Data to send
    let reqData = {
        prodName: req.body.prodName,
        prodType: req.body.prodType,
        prodPrice: req.body.prodPrice,
        prodQuantity: req.body.prodQuantity
    } 
    let params = [reqData.prodName, reqData.prodType, reqData.prodPrice, reqData.prodQuantity];
    // Adds data to database
    db.run(`INSERT INTO products (prodName, prodType, prodPrice, prodQuantity) VALUES(?,?,?,?)`, params, function (err, result) {
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
app.patch('/api/products/:id', (req, res, next) => {
    // Data to edit
    let reqData = {
        prodName: req.body.prodName,
        prodType: req.body.prodType,
        prodPrice: req.body.prodPrice,
        prodQuantity: req.body.prodQuantity
    };
    // Updates data in database
    db.run(`UPDATE products set 
            prodName = COALESCE(?,prodName),
            prodType = COALESCE(?,prodType),
            prodPrice = COALESCE(?,prodPrice),
            prodQuantity = COALESCE(?,prodQuantity)
            WHERE id = ?`,
        [reqData.prodName, reqData.prodType, reqData.prodPrice, reqData.prodQuantity, req.params.id],
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
// DELETE
app.delete("/api/products/:id", (req, res, next) => {
    // Deletes product from database
    db.run(`DELETE FROM products WHERE id = ?`, req.params.id, function (err, result) {
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









// Transactions
// GET ALL
app.get('/api/transactions', (req, res, next) => {
    let resData = 'SELECT * FROM transactions';
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
app.get('/api/transactions/:id', (req, res, next) => {
    let params = [req.params.id];
    let resData = "SELECT * from transactions where id = ?";
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
app.post('/api/transactions', (req, res, next) => {
    let errors = [];

    if ((req.body.tranProd == null) ||
        (req.body.tranQuantity == null) ||
        (req.body.tranClientId == null) ||
        (req.body.tranPrice == null) ||
        (req.body.tranDateTime == null) &&
        (req.body.tranPaidStatus == null))
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
        tranProd: req.body.tranProd,
        tranQuantity: req.body.tranQuantity,
        tranClientId: req.body.tranClientId,
        tranPrice: req.body.tranPrice,
        tranDateTime: req.body.tranDateTime,
        tranPaidStatus: req.body.tranPaidStatus
    } 
    let params = [reqData.tranProd, reqData.tranQuantity, reqData.tranClientId, reqData.tranPrice, reqData.tranDateTime];
    db.run(`INSERT INTO transactions (tranProd, tranQuantity, tranClientId, tranPrice, tranDateTime, tranPaidStatus) VALUES(?,?,?,?,?,?)`, params, function (err, result) {
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
app.patch('/api/transactions/:id', (req, res, next) => {
    let reqData = {
        tranProd: req.body.tranProd,
        tranQuantity: req.body.tranQuantity,
        tranClientId: req.body.tranClientId,
        tranPrice: req.body.tranPrice,
        tranDateTime: req.body.tranDateTime,
        tranPaidStatus: req.body.tranPaidStatus
    };
    db.run(`UPDATE transactions set 
            tranProd = COALESCE(?,tranProd),
            tranQuantity = COALESCE(?,tranQuantity),
            tranClientId = COALESCE(?,tranClientId),
            tranPrice = COALESCE(?,tranPrice),
            tranDateTime = COALESCE(?,tranDateTime),
            tranPaidStatus = COALESCE(?, tranPaidStatus)
            WHERE id = ?`,
        [reqData.tranProd, reqData.tranQuantity, reqData.tranClientId, reqData.tranPrice, reqData.tranDateTime, reqData.tranPaidStatus],
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
// DELETE
app.delete("/api/transactions/:id", (req, res, next) => {
    db.run(`DELETE FROM transactions WHERE id = ?`, req.params.id, function (err, result) {
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

app.patch('/api/transactions/paid/:id', (req, res, next) => {
    
    let reqData = {
    tranPaidStatus: req.body.tranPaidStatus
    };

    db.run(`UPDATE transactions set
            tranPaidStatus = COALESCE(?, tranPaidStatus)
            WHERE id = ?`,
        [reqData.tranPaidStatus, req.params.id],
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



app.use('/', (req, res) => {
    res.status(404).json({
        "error": "404",
        "message": "Page not found"
    });
})
app.use((req, res) => {
    res.status(404)
}); 

