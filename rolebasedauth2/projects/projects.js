const express = require("express");
const {ROLE,users,projects} = require("../data");
const { authUser,authAdmin } = require("../basicAuth");
const { authLoggedIn } = require("../../rolebasedauth/basicAuth");
const {scopeProject,canViewProject,canDeleteProject} = require("./permissions");

const router = express.Router();

router.get("/projects",authUser,(req,res) => {
    res.send(scopeProject(req.user,req.project)); 
})

router.get("/project/:id",setProject,authUser,authGetProject,(req,res) => {
    res.send(req.project);
})

router.delete("/project/:id",setProject,authUser,authDeleteProject,(req,res) => {
    res.send("Project deleted");
})

function setProject(req,res,next){

    const projectId = parseInt(req.params.id);
    
    if(projectId){
        req.project = projects.find((project) => project.id == projectId);
    }

    next();
}

function authGetProject(req,res,next){
    if(!(canViewProject(req.user,req.project))){
        return res.status(403).send("Not allowed");
    }
    next();
}

function authDeleteProject(req,res,next){
    if(!(canDeleteProject(req.user,req.project))){
        return res.status(403).send("Not allowed to delete");
    }

    next();
}

module.exports = router;