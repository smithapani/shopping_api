const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, "Please enter atleast 2 characters"],

    },

    email: {
        type: String,
        required: true,
        unique: [true, "Must be unique email"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email must be valid email address");
            }
        }
    },

    rollno: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Roll number can not be negative")
            }
        }

    },

    stype: {
        type: String
    },

    active: {
        type: String,
        default : true
    },

    password : {
        type : String,
        required : true,
        validate(value){
            if(value.length < 8){
                throw new Error("Please enter atleast 8 characters");
            }
        }
    },

    cpassword : {
        type : String,
        validate(value){
            if(value.length == 0 || value.length < 8){
                throw new Error("Please enter atleast 8 characters");
            }
        }
    },

    date: {
        type: Date,
        default: Date.now()
    },

    tokens : [{
        token : {
            type : String
        }
    }]
})

studentSchema.pre("save",async function(next) {

    if(this.isModified("password")){

        this.password = await bcrypt.hash(this.password,10);
        this.cpassword = undefined;
    }

    next();
})

studentSchema.methods.generateAuthToken = async function(){

    console.log(this._id.toString());

    const token = await jwt.sign({_id : this._id.toString()},"mynameissmithapani");

    console.log(token);

    this.tokens = this.tokens.concat({token}); 

    await this.save();

    return token;

}

const Student = new mongoose.model("Student", studentSchema);
module.exports = Student;