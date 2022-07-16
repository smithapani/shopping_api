const express = require("express");
const { authUser,authAdmin } = require("./basicAuth");
const {ROLE,users,projects} = require("./data");
const projectRouter = require("./projects/projects");

const app = express();

app.use(express.json());

app.use(setUser);

app.use("/",projectRouter);

app.get("/home",(req,res) => {
    console.log("home");
    res.send("home");
})

app.get("/dashboard",authUser,(req,res) => {
    console.log("dashboard");
    res.send("dashboard");
})

app.get("/admin",authUser,authAdmin,(req,res) => {
    console.log("admin");
    res.send("admin");
})

function setUser(req,res,next){
    const userId = req.body.userId;

    if(userId){
        req.user = users.find((user) => user.id == userId);
    }

    next();
}

app.listen(3000,() => {
    console.log("Server running on 3000");
})