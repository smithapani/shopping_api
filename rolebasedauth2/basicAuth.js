function authUser(req,res,next){
    if(req.user == null){
        return res.status(401).send("You need to sign in to access the dashboard")
    }

    next();
}

function authAdmin(req,res,next){
    if(req.user.role !== "admin"){
        return res.status(403).send("Not authorized to view this page");
    }

    next();
}

module.exports = {authUser,authAdmin};