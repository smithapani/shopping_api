const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const Student = require("./studentModel");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const itemSchema = mongoose.Schema({

    owner : {
        type : ObjectId,
        ref : 'Student',
        required : true
    },

    name : {
        type : String,
        required : true,
        trim : true,
        minlength : 2,
        validate(value){
            if(value.length < 2){
                throw new Error("Name can not be less then 2 characters");
            }
        }
    },

    description : {
        type : String,
        required : true,
    },

    category : {
        type : String,
        required : true,
        trim : true
    },

    price : {
        type : Number,
        required : true,
        default : 0,
        validate(value){
            if(value < 0){
                throw new Error("Price can not be negative");
            }
        }
    }
})

const Item = mongoose.model("Item",itemSchema);
module.exports = Item;