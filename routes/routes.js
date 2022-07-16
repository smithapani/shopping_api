const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Student = require("../models/studentModel");
const Item = require("../models/itemModel");
const Cart = require("../models/cartModel");
const Auth = require("../middlewares/Auth");

const router = express.Router();

router.get("/",(req,res) => {
    res.send("helloooo");
})

//Secret Page
router.get("/secret",Auth,(req,res) => {
    console.log(`Cookie value : ${req.cookies["jwt"]}`);
    res.render("secret");
})


//Get Registration Page
router.get("/register",(req,res) => {
    res.render("register");
})

//Post Registration Page
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

//Get Login Page
router.get("/login",(req,res) => {
    res.render("login");
})

//Post Login Page
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
                expires : new Date(Date.now() + 1800000),
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

//Logout single and all
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


/*---------------------------------------------Item----------------------------------------------------*/


//Get New Item Page
router.get("/items",Auth,(req,res) => {
    res.render("item");
})

//Create New Item
router.post("/items",Auth,async (req,res) => {
    try{
        const item = new Item({
            owner : req.verifyUser._id,
            ...req.body
        });

        const itemDetails = await item.save();
        console.log("Item Details : "+itemDetails);

        res.json({
            'msg' : "Item created successfully",
            'item' : itemDetails
        })

    }
    catch(err){
        res.json({
            'msg' : err.message
        })
    }
})

//Get One Item
router.get("/item/:id",async (req,res) => {
    try{
        const itemFound = await Item.findOne({_id : req.params.id});    

        if(!itemFound){
            console.log("Item not found");
            res.status(404).send("Item not found");
        }
        else{
            console.log(itemFound);
            res.json({
                'msg' : "Item found for particular id",
                'item' : itemFound
            })
        }
    }
    catch(err){
        res.json({
            'msg' : err.message
        })
    }
})

//Get All Items
router.get("/allitems",async (req,res) => {
    try{
        const allItems = await Item.find();

        if(allItems){
            res.json({
                'msg' : "Item found",
                'item' : allItems
            })
        }
        else{
            res.status(404).send("Item not found");
        }
    }
    catch(err){
        res.json({
            'msg' : err.message
        })
    }
})

//Update item
router.put("/item/:id",Auth,async (req,res) => {
    try{
        
        const keys = Object.keys(req.body);
        
        const allowedUpdates = ['name','description','category','price'];

        const isValidOperation = keys.every((update) => {
            return allowedUpdates.includes(update)
        })

        console.log("isValidOperation : " +isValidOperation);

        
        if(!isValidOperation){
            return res.status(400).send({ error: 'invalid updates'})
        } 

        const updatedData = await Item.findOneAndUpdate({_id : req.params.id},req.body,{new : true},(err) => {
            if(!err){
                res.json({
                    "msg" : "Updated successfully",
                })
            }
            else{
                res.status(400).send({ error: 'error while updating'})
            }
        })

        console.log("Updated data : " +updatedData);    

       
    }
    catch(err){
        console.log("Server error" ,err.message);
    }
})

//Delete item
router.delete('/item/:id', Auth, async(req, res) => {
    try {
        const deletedItem = await Item.findOneAndDelete( {_id: req.params.id} )

        if(!deletedItem) {
            res.status(404).send({error: "Item not found"})
        }
        res.send(deletedItem)

    } 
    catch (error) {
        res.status(400).send(error.message)
    }
}) 


/*-----------------------------------------------------Cart--------------------------------------------------------*/

//Create cart
//First check whether item exist in the cart
router.post("/cart",Auth, async (req,res) => {
    const owner = req.verifyUser._id;

    const itemId = req.body.itemId;
    const quantity = req.body.quantity;
    console.log("quantity" +quantity);

    try{
        const cart = await Cart.findOne({owner});
        console.log("Cart : ",cart);

        const item = await Item.findOne({_id : itemId});
        console.log("item",item);

        if(!item){
            return res.status(404).send({ message: "item not found" });
        }

        const name = item.name;
        const description = item.description;
        const category = item.category;
        const price = item.price;
        console.log("price" +price);

        const bill = quantity*price;
        console.log("bill" +bill);

        //First check whether item exist in the cart or not

        if(cart){
            const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
            console.log("itemIndex",itemIndex);

            if(itemIndex > -1){
                let product = cart.items[itemIndex];
                console.log("product",product);

                product.quantity += quantity;

                cart.bill = cart.items.reduce((acc,curr) => {
                    return acc + curr.quantity*curr.price
                },0)

                cart.items[itemIndex] = product;

                await cart.save();

                res.status(200).send(cart);
            }

            //Item in the cart will not exist, so we will push the item

            else{
                cart.items.push({itemId, name, category, quantity, price});
                cart.bill = cart.items.reduce((acc,item) => {
                    return acc+item.quantity*item.price
                },0)

                await cart.save();

                res.status(200).send(cart);
            }
        }

        //No cart, so add item in the cart

        else{
            const newCart = await Cart.create({
                owner,
                items : [{
                    itemId, name, category, quantity, price
                }],
                bill : bill
            })
    
            return res.status(201).send(newCart);
        }

    }

    catch(err){
        console.log(err.message)
        res.send("Something went wrong...");
    }
})

//Get cart
router.get("/cart",Auth,async(req,res) => {
    const owner = req.verifyUser._id;

    try{
        const cart = await Cart.findOne({owner});
        console.log("Get cart : ",cart);

        if(cart){
            res.send(cart);
        }
        else{
            res.json({
                'msg' : 'cart not found'
            })
        }
    }
    catch(err){
        res.send(err.message);
    }
    
})

//delete item from cart
router.delete("/cart/",Auth, async(req,res) => {

    try{
        const owner = req.verifyUser._id;
        const itemId = req.query.itemId;

        const item = await Cart.findOne({itemId});

        let cart = await Cart.findOne({owner});
        console.log("DELETE : cart",cart);

        const itemIndex = cart.items.findIndex((item) => {
            return item.itemId == itemId
        })

        console.log("DELETE function : Item index",itemIndex);

        if(itemIndex > -1){
            let product = cart.items[itemIndex];

            cart.bill -= product.price*product.quantity;

            if(cart.bill < 0){
                cart.bill = 0;
            }

            cart.items.splice(itemIndex,1);

            cart.bill = cart.items.reduce((acc,item) => {
                return acc+item.price*item.quantity
            },0)



            cart = await cart.save();
            res.status(200).send(cart);
        }

        else{
            return res.json({
                'msg' : 'item is not there in the cart'
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(400).send();
    }
    
})



module.exports = router;