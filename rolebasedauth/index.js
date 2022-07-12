const express = require("express");
const {ROLE,users,projects} = require("./data");
const {authAdmin,authLoggedIn} = require("./basicAuth");
const projectRouter = require("./projects/projects");

const app = express();

app.use(express.json());

app.use(setUser);

app.use("/",projectRouter);

app.get("/home",(req,res) => {
    console.log("home page")
    res.send("home page")
})

app.get("/dashboard",authLoggedIn,(req,res) => {
    console.log("dashboard page")
    res.send("dashboard page")
})

app.get("/admin",authLoggedIn,authAdmin(ROLE.ADMIN),(req,res) => {
    console.log("admin page")
    res.send("admin page")
})

app.listen(3000,() => {
    console.log("server running on 3000");
})

function setUser(req,res,next){
    const userId = req.body.id;

    if(userId){
        req.user = users.find((user) => user.id == userId);
    }

    next();
}