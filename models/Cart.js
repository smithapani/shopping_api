const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.SchemaTypes.ObjectId;
const User = require("./User");
const Item = require("./Item");

const cartSchema = new mongoose.Schema({
    userId : {
        type : ObjectId,
        required : true,
        ref : 'User'
    },

    items : [{
        itemId : {
            type : ObjectId,
            required : true,
            ref : 'Item'
        },

        name : {
            type : String,
            required : true
        },

        category : {
            type : String
        },

        quantity : {
            type : Number,
            default : 1,
            min : 1,
            required : true
        },

        price : {
            type : Number,
            default : 0,
            required : true
        }
    }],

    bill : {
        type : Number,
        default : 0,
        required : true
    }
})

const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;