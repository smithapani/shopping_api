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
        trim : true
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
        required : true
    }
})

const Item = mongoose.model("Item",itemSchema);
module.exports = Item;