const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:\\Users\\antonio\\Downloads\\test.db');

const express = require("express");
const app = express();
const port = 3000;
 
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.get('register.html', (req, res, next) => {
    res.sendFile(__dirname + '/' + 'register.html');
});

// Insert here other API endpoints

app.get("/api/users", (req, res, next) => {
    let sql = "select * from utenti"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows || []
        })
      });
});

app.get("/api/user/:id", (req, res, next) => {
    let sql = "select * from utenti where id = ?"
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row || {}
        })
      });
});

/*
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
*/

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post("/api/user/", (req, res, next) => {
    let errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    let data = {
        email: req.body.email,
        password : req.body.password
    }
    let sql ='INSERT INTO utenti (email, password) VALUES (?,?)'
    let params =[data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});

app.put("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE utenti set  
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.email, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM utenti WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});