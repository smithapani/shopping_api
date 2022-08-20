const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ObjectId = mongoose.SchemaTypes.ObjectId;

const userSchema = mongoose.Schema({

    firstname : {
        type : String,
        required : true,
        trim : true,
        min : 3,
        validator(value){
            if(value.length < 3){
                throw new Error("Please provide atleast 3 characters");
            }
        }
    },

    lastname : {
        type : String,
        required : true,
        trim : true,
        min : 3,
        validator(value){
            if(value.length < 3){
                throw new Error("Please provide atleast 3 characters");
            }
        }
    },

    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please provide valid email")
            }
        }
    },

    mobile : {
        type : Number,
        required : true,
        unique : true,
        min : 10,
        validate(value){
            if(value.length < 10 || value.length > 10){
                throw new Error("Please provide valid number")
            }
        }
    },

    password : {
        type : String,
        required : true,
        min : 8,
        validator(value){
            if(value.length < 8){
                throw new Error("Please provide atleast 8 characters");
            }
        }
    },

    confirmpassword : {
        type : String,
        min : 8,
        validator(value){
            if(value.length < 8){
                throw new Error("Please provide atleast 8 characters");
            }
        }
    },

    image : {
        type : String
    },

    role : {
        type : String,
        required : true
    },

    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
})

userSchema.pre("save",async function(next) {

    if(this.isModified("password")){

        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = undefined;
    }

    next();
})

userSchema.methods.generateAuthToken = async function(){

    console.log(this._id.toString());

    const token = await jwt.sign({_id : this._id.toString()},process.env.SECRET_KEY);

    console.log(token);

    this.tokens = this.tokens.concat({token}); 

    await this.save();

    return token;

}

const User = mongoose.model("User",userSchema);

module.exports = User;