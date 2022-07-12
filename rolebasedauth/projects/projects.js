const express = require("express");
const {ROLE,users,projects} = require("../data");
const {authLoggedIn} = require("../basicAuth");
const {canViewProject,canDeleteProject,scopeProject} = require("../projects/permissions");

const app = express();

const router = express.Router();


router.get("/projects",authLoggedIn,(req,res) => {
    res.json(scopeProject(req.user,req.project));
})

router.get("/project/:id",setProject,authLoggedIn,authGetProject,(req,res) => {
    res.json(req.project)
})

router.delete("/project/:id",setProject,authLoggedIn,authDeleteProject,(req,res) => {
    res.send("Project deleted");
})

function setProject(req,res,next){
    const projectId = parseInt(req.params.id);
    console.log("Project Id : ",projectId);

    if(projectId){
        req.project = projects.find((project) => project.id == projectId);

        if(req.project == null){
            res.status(404).send("Project not found for this id");
        }
    }
    else{
        res.status(404).send("Please provide project id");
    }
    
    next(); 
}

function authGetProject(req,res,next){
    if(!canViewProject(req.user,req.project)){
        return res.status(403).send("Not allowed")
    }

    next();
}

function authDeleteProject(req,res,next){
    if(!canDeleteProject(req.user,req.project)){
        return res.status(403).send("Not allowed")
    }

    next();
}

module.exports = router;