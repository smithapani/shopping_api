const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

async function auth(req,res,next) {

    try {
        console.log(req.cookies);

        const token = req.cookies["jwt"];
        console.log("token in auth : ", token);

        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        console.log("decoded", decoded)

        const verifyUser = await User.findOne({ _id: decoded._id });
        console.log("verifyUser", verifyUser);

        req.token = token;
        req.verifyUser = verifyUser;

        next();

    }
    catch (err) {
        res.status(401).json({
            "msg" : "Unauthenticated. May be you need to login again."
        })
        console.log(err.message);
    }

}

function authRole(role){
    return(req,res,next) => {
        if(req.verifyUser.role !== role){
            return res.status(401).json({
                'error' : 'You are not an admin, so not allowed'
            })
        }

        next();
    }
}

module.exports = {auth,authRole};