const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.json());

//Create connection
var db = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "password",
    multipleStatements: true,
    insecureAuth : true,
    database : "nodemysql"
});

db.connect((err) => {
    if(err){
        throw err
    }

    console.log("Mysql connection succeded");
})

app.get("/createdb",(req,res) => {
    let sql = "CREATE DATABASE nodemysql";

    db.query(sql,(err,result) => {
        if(err){
            throw err;
        }

        console.log(result);

        res.send("Database created....");
    })
})

app.get("/createpoststable",(req,res) => {
    let sql = 'CREATE TABLE posts(id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), body VARCHAR(255))';

    db.query(sql,(err,result) => {
        if(err){
            console.log("hii");
            console.log("error",err);
            throw err
        }

        console.log(result);

        res.send("Table created...")
    })
})

app.post("/addpost1",(req,res) => {

    /*
    let post = {
        title : req.body.title,
        body : req.body.body
    }
    */

    let {title,body} = req.body;

    let sql = "INSERT INTO posts SET ?";

    db.query(sql,{title,body},(err,result) => {
        if(err){
            console.log("hii");
            console.log("error",err);
            throw err
        }

        console.log(result);

        res.send("Data added...")
    })
})

app.get("/getallposts",(req,res) => {
    let sql = "SELECT * FROM posts";

    db.query(sql,(err,result) => {
        if(err){
            console.log("hii");
            console.log("error",err);
            throw err
        }

        console.log(result);

        res.send(result);
    })
})

app.get("/getpost/:id",(req,res) => {
    const id = req.params.id;

    let sql = `SELECT title,body FROM posts WHERE id = ${req.params.id}`;

    db.query(sql,(err,result) => {
        if(err){
            console.log("hii");
            console.log("error",err);
            throw err
        }

        console.log(result);

        res.send(result);
    })
})

app.put("/updatepost/:id",(req,res) => {

    let post = {
        title : req.body.title,
        body : req.body.body
    }

    let sql = `UPDATE posts SET ? WHERE id = ${req.params.id}`;

    db.query(sql,post,(err,result) => {
        if(err){
            console.log("hii");
            console.log("error",err);
            throw err
        }

        console.log(result);

        res.send(result);
    })
})

app.delete("/deletepost/:id",(req,res) => {

    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;

    db.query(sql,(err,result) => {
        if(err){
            console.log("hii");
            console.log("error",err);
            throw err
        }

        console.log(result);

        res.send(result);
    })
})

app.listen(3000,() => {
    console.log("Server running on 3000");
})