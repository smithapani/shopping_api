const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Student = require("../models/studentModel");
const Auth = require("../middlewares/Auth");

const router = express.Router();

router.get("/",(req,res) => {
    res.send("helloooo");
})

router.get("/secret",Auth,(req,res) => {
    console.log(`Cookie value : ${req.cookies["jwt"]}`);
    res.render("secret");
})

router.get("/logout",Auth,async (req,res,next) => {
    try{

        console.log("User found : "+req.verifyUser);

        //Logout from current login
        /*
        req.verifyUser.tokens = req.verifyUser.tokens.filter((token) => {
            return token.token != req.token;
        })
        */

        //Logout from all login
        
        req.verifyUser.tokens = [];
        
        res.clearCookie("jwt");

        await req.verifyUser.save();

        res.redirect("login");


    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

router.get("/register",(req,res) => {
    res.render("register");
})

router.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password == cpassword){
            const student = new Student({
                name: req.body.name,
                email: req.body.email,
                rollno: req.body.rollno,
                stype: req.body.stype,
                active: req.body.active,
                password: req.body.password,
                cpassword: req.body.cpassword
            })

            const token = await student.generateAuthToken();
            console.log("Registration Token : "+token);

            res.cookie("jwt",token,{
                expires : new Date(Date.now() + 600000)
            });
    
            const data = await student.save();
    
            console.log(data);

            res.json({data});
        }
        else{
            res.json({
                "msg" : "Password does not match"
            })
        }
        
    }
    catch (error) {
        console.log(error.message);
    }
    
})

router.get("/login",(req,res) => {
    res.render("login");
})

router.post("/login",async (req,res) => {

    const email = req.body.email;
    const password = req.body.password;

    const userObj = await Student.findOne({email : email});
    console.log(userObj);

    if(userObj){

        const match = await bcrypt.compare(password,userObj.password);
        console.log(match);

        if(match){

            const token = await userObj.generateAuthToken();
            console.log("Login Token : "+token);

            res.cookie("jwt",token,{
                expires : new Date(Date.now() + 1200000),
                secure : false
            });

            res.json({
                "msg" : "Logged in successfully"
            })
        }

        else{
            res.status(401).json({
                "msg" : "Password does not match"
            })
        }
    }
    else{
        res.status(401).json({
            "msg" : "These credentials do not match our records"
        })
    }
})

module.exports = router;