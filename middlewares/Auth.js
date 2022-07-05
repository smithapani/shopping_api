const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");

const auth = async(req,res,next) => {
    try{
        const token = req.cookies["jwt"];
        console.log("Token inside auth : " +token);

        const verify = jwt.verify(token,"mynameissmithapani");
        console.log(verify);

        const verifyUser = await Student.findOne({_id : verify._id});
        console.log("Verify User : " +verifyUser);

        req.token = token;
        req.verifyUser = verifyUser;

        next();
    }
    catch(error){
        res.status(401).json({
            "msg" : "Unauthenticated. May be you need to login again."
        })
    }
}

module.exports = auth;