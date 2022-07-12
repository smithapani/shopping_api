const {ROLE,users, projects} = require("../data");

function canViewProject(user,project){
    return(user.role == "admin" || project.userId == user.id)
}

function canDeleteProject(user,project){
    return project.userId == user.id
}

function scopeProject(user,project){

    console.log("Inside scopeproject");

    if(user.role == "admin"){
        return projects;
    }

    return projects.filter((project) => project.userId == user.id);
}

module.exports = {canViewProject,canDeleteProject,scopeProject};