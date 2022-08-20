const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.SchemaTypes.ObjectId;
const User = require("./User");

const itemSchema = mongoose.Schema({
    userId : {
        type : ObjectId,
        required : true,
        ref : 'User'
    },

    name : {
        type : String,
        required : true,
    },

    category : {
        type : String
    },

    price : {
        type : Number,
        required : true,
        default : 0
    },

    description : {
        type : String
    },

    images : [{
        type : String
    }]
})

const Item = mongoose.model("Item",itemSchema);

module.exports = Item;