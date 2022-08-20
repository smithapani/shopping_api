const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const User = require("../models/User");
const Item = require("../models/Item");
const Cart = require("../models/Cart");
const {auth,authRole} = require("../middleware/auth");
const {canViewItem,scopedItem,canDelete} = require("../middleware/itemAuth");

const router = express.Router();

router.use(cookieParser());

//--------------------------------------Registration-------------------------------------------------

function checkFileType(file,cb){
    const allowedFileTypes = /jpg|jpeg|png/;

    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    console.log(extname);

    if(extname){
        return cb(null,true)
    }
    else{
        cb(new Error("Please upload images only"));
    }
}

let storage = multer.diskStorage({
    dest : "avatars",
    limits : {
        fileSize : 1000000
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
})



//Single upload
const upload = multer({
    storage : storage,
    fileFilter(req,file,cb){

        // Check for pdf only here

        /*
        if(!file.originalname.endsWith('.pdf')){
            return cb(new Error('Please upload a pdf'))
        }

        cb(null, true);
        */

        checkFileType(file,cb);
    }
}).single('image');



//Multiple upload
const multipleupload = multer({
    storage : storage,
    fileFilter(req,file,cb){

        // Check for pdf only here

        /*
        if(!file.originalname.endsWith('.pdf')){
            return cb(new Error('Please upload a pdf'))
        }

        cb(null, true);
        */

        checkFileType(file,cb);
    }
}).array('images',10);



router.post("/register", upload, async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        console.log("filename : ",req.file.filename);

        if (password == cpassword) {
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                image : req.file.filename,
                role : req.body.role
            })

            const token = await user.generateAuthToken();
            console.log("Registration Token : " + token);

            res.cookie("jwt", token, {
                maxAge: 2 * 60 * 60 * 1000,
                secure: false
            });

            const data = await user.save();
            console.log(data);
            res.json({ data });

        }
        else {
            res.json({
                "error": "Password does not match"
            })
        }

    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Error while saving an user");
    }

})



//--------------------------------------Login-------------------------------------------------
router.post("/login", async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const userObj = await User.findOne({ email: email });
        console.log(userObj);

        if (userObj) {

            const match = await bcrypt.compare(password, userObj.password);
            console.log(match);

            if (match) {

                const token = await userObj.generateAuthToken();
                console.log("Login Token : " + token);

                res.cookie("jwt", token, {
                    maxAge: 2 * 60 * 60 * 1000,
                    secure: false
                });

                res.json({
                    "msg": "Logged in successfully"
                })
            }

            else {
                res.status(401).json({
                    "error": "Password does not match"
                })
            }
        }
        else {
            res.status(401).json({
                "error": "These credentials do not match our records"
            })
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Error while login");
    }


})



//--------------------------------------Item-------------------------------------------------
//Post an item
router.post("/items", auth, authRole('admin'), multipleupload , async (req, res) => {

    try {

        const owner = await User.findOne({ _id: req.verifyUser._id });
        console.log("owner : ", owner);

        if (owner) {

            const existingItem = await Item.findOne({ name: req.body.name });

            //This way you can convert to string
            /*
            let filenames = req.files.map((file) => {
                return file.filename
            });

            filenames = filenames.join(', ');
            */

            //This way you can give array as well
            let filenames = req.files.map((file) => {
                return file.filename
            })



            if (!existingItem) {
                const item = new Item({
                    userId: owner._id,
                    name: req.body.name,
                    category: req.body.category,
                    price: req.body.price,
                    description: req.body.description,
                    images : filenames
                })

                const itemSave = await item.save();

                console.log("item : ", itemSave);

                res.status(200).json({
                    'msg': 'item saved successfully',
                    'item': itemSave
                })
            }

            else {
                res.status(400).json({
                    'error': 'This item name already exist'
                })
            }

        }

        else {
            res.status(400).json({
                'error': 'No owner found with particular id'
            })
        }

    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Error while saving an item");
    }

})



//Get an item
router.get("/item/:id", setItem, auth, authGetItem, async (req, res) => {

    try {
        const itemId = req.params.id;

        const item = await Item.findOne({ _id: itemId });

        if (item) {
            res.status(200).json({
                'msg': 'Fetched item',
                'item': item
            })
        }
        else {
            res.status(400).json({
                'error': 'This item does not exist'
            })
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Error while fetching single item");
    }

})



//Get all items
router.get("/allitems",auth, async (req, res, next) => {

    try {
        const items = await Item.find({});

        res.status(200).json(scopedItem(req.verifyUser,items));
        
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Error while fetching all items");
    }

})



//Update an item
router.put("/item/:id", auth, authRole('admin'),async (req, res, next) => {

    try {
        const itemId = req.params.id;

        const item = await Item.findOne({ _id: itemId });

        if (item) {

            const allowedUpdates = ['name', 'category', 'price', 'description'];

            const updates = Object.keys(req.body);
            console.log("updates : ", updates);

            const isAllowed = updates.every((key) => {
                return allowedUpdates.includes(key)
            })
            console.log("isAllowed", isAllowed);


            if (isAllowed) {
                await Item.findOneAndUpdate({ _id: itemId }, req.body, { new: true }, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            'msg': 'item updated',
                            'item': data
                        })
                    }
                    else {
                        res.status(400).json({
                            'msg': 'There is no item to update',
                        })
                    }
                })
            }

            else {
                res.status(400).json({
                    'error': 'This is invalid update',
                })
            }

        }

        else {
            res.status(400).json({
                'msg': 'There is no item to update',
                'items': item
            })
        }
    }
    catch (err) {
        console.log(err.message);
    }


})



//Remove an item
router.delete("/item/:id",setItem, auth, authDelete,async (req, res) => {

    try {
        const itemId = req.params.id;

        const item = await Item.findOne({ _id: itemId });

        if (!item) {
            res.status(400).json({
                'error': 'There is no item to delete',
            })
        }

        else {
            //const deletedItem = await item.remove();

            res.status(200).json({
                'msg': 'item deleted successfully',
                //'deleted item ': deletedItem
            })
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Error while deleting item");
    }


})



//--------------------------------------Cart-------------------------------------------------
router.post("/cart", auth, async (req, res, next) => {

    try {
        //First check whethere there is an item exist or not

        const owner = await User.findOne({ _id: req.verifyUser._id });
        console.log("owner", owner);

        const userId = owner._id;
        const itemId = req.body.itemId;
        const quantity = req.body.quantity;
        console.log("quantity", quantity);

        const item = await Item.findOne({ _id: req.body.itemId });
        console.log("Item", item);

        if (!item) {
            return res.status(400).json({
                'error': 'There is no item to add into the cart',
            })
        }


        const name = item.name;
        const category = item.category;
        const price = item.price;
        console.log("price", price);

        const bill = quantity * price;
        console.log("bill", bill);

        //Check whether the item is added in the cart or not

        const cart = await Cart.findOne({ userId });
        console.log("cart", cart);

        if (cart) {
            console.log("Inside cart");

            const itemIndex = cart.items.findIndex((i) => {
                return i.itemId == itemId
            })

            console.log("itemindex",itemIndex);

            if (itemIndex > -1) {

                console.log("itemindex is grater than");

                let product = cart.items[itemIndex];
                product.quantity += quantity;

                cart.bill = cart.items.reduce((acc, i) => {
                    return acc + i.price * i.quantity
                }, 0)

                cart.items[itemIndex] = product

                await cart.save();

                res.status(200).send(cart);
            }

            else {

                console.log("itemindex is -1");

                cart.items.push({ itemId, name, category, quantity, price });

                cart.bill = cart.items.reduce((acc, i) => {
                    return acc + i.price * i.quantity
                }, 0)

                await cart.save();

                res.status(200).send(cart);
            }
        }

        else {

            console.log("Cart not found so else")
            const newCart = await Cart.create({
                userId,
                items: [{
                    itemId, name, category, quantity, price
                }],
                bill
            })

            return res.status(201).send(newCart);
        }


    }

    catch (err) {
        console.log(err.message)
        res.send("Something went wrong...");
    }

})



//Get cart
router.get("/getcart", auth, async (req, res, next) => {

    try {
        const cart = await Cart.findOne({ userId: req.verifyUser._id });
        console.log("cart", cart);

        if (!cart) {
            return res.status(404).send("Cart not found for the user");
        }

        else {
            return res.status(201).send(cart);
        }
    }
    catch (err) {
        condole.log(err.message);
        res.status(500).send("Server error");
    }

})



//Remove item from the cart
router.delete("/deletecart", auth, async (req, res) => {

    //First check whether the item is there in the cart
    const itemId = req.body.itemId;
    const quantity = req.body.quantity;

    const cart = await Cart.findOne({ userId: req.verifyUser._id });
    console.log("cart", cart);

    if (cart) {

        const itemIndex = cart.items.findIndex((i) => {
            return i.itemId == itemId
        })
        console.log("itemIndex : ",itemIndex);

        if(itemIndex > -1){
            
            cart.items[itemIndex].quantity -= quantity;

            if(cart.items[itemIndex].quantity <= 0){
                cart.items.splice(itemIndex,1);
            }

            cart.bill = cart.items.reduce((acc,i) => {
                return acc + i.quantity * i.price
            },0)

            if(cart.bill < 0){
                cart.bill = 0;
            }

            await cart.save();

            res.status(200).send(cart);

        }

        else{
            res.status(400).json({
                'error' : 'Item not found in the cart'
            })
        }

    }

    else{

        res.status(400).json({
            'error' : 'Cart not found'
        })

    }

})
    

//Add image for the products(This can be multiple)

//setItem
async function setItem(req,res,next){
    let itemId = req.params.id;
    itemId = itemId.toString();

    req.item = await Item.findOne({_id : itemId});
    console.log("req.item",req.item);

    if(req.item == null){
        return res.status(404).json({
            'error' : 'Item not found'
        })
    }

    next();
}



//canViewProject
function authGetItem(req,res,next){
    if(!canViewItem(req.verifyUser, req.item)){
        console.log("req.verifyUser._id",req.verifyUser._id);
        console.log("req.item.userId",req.item.userId);
        console.log("canViewItem(req.verifyUser, req.item)",canViewItem(req.verifyUser, req.item));
        return res.status(401).json({
            'error' : 'You are not allowed to view this item'
        })
    }

    next();
}



//canDeleteProject
function authDelete(req,res,next){
    if(!canDelete(req.verifyUser, req.item)){
        console.log("req.verifyUser._id",req.verifyUser._id);
        console.log("req.item.userId",req.item.userId);
        console.log("canDelete(req.verifyUser, req.item)",canDelete(req.verifyUser, req.item));
        return res.status(401).json({
            'error' : 'You are not allowed to delete this item'
        })
    }

    next();
}


module.exports = router;

