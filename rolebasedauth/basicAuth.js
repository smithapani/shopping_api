function authLoggedIn(req,res,next){

    console.log("authLoggedIn",req.user);

    if(!(req.user)){
        return res.status(403).send("Please log in")
    }

    next();
}

function authAdmin(role){
    return (req,res,next) => {
        console.log("authAdmin",req.user);

        if(req.user.role !== role){
            return res.status(401).send("You can't access the page as you are basic");
        }

        next();
    }

}

/*------------------OR---------------------*/

/*
function authAdmin(){

    console.log("authAdmin",req.user);

    if(req.user.role !== "admin"){
        return res.status(401).send("You can't access the page as you are basic user");
    }

    next();
}
*/

module.exports = {authAdmin,authLoggedIn};