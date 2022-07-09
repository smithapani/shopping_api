const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const Student = require("./studentModel");
const Item = require("./itemModel");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const cartSchema = mongoose.Schema({
    owner : {
        type : ObjectId,
        ref : 'Student',
        required : true
    },

    items : [{
        itemId : {
            type : ObjectId,
            ref : 'Item',
            required : true
        },

        name : {
            type : String,
            required : true,
            trim : true
        },

        category : {
            type : String,
            required : true,
            trim : true
        },

        quantity : {
            type : Number,
            required : true,
            min : 1,
            default : 1,
        },

        price : {
            type : Number,
            required : true,   
            default : 0 
        }
    }],

    bill : {
        type : Number,
        required : true,
        default : 0
    }
})

const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;