const ROLE = {
    ADMIN : "admin",
    BASIC : "basic"
}

const users = [
    {
        id : 1,
        name : "smit",
        role : ROLE.ADMIN
    },
    {
        id : 2,
        name : "arun",
        role : ROLE.BASIC
    },
    {
        id : 3,
        name : "meet",
        role : ROLE.BASIC
    }

]

const projects = [
    {
        id : 1,
        name : "smit's project",
        userId : 1
    },
    {
        id : 2,
        name : "arun's project",
        userId : 2
    },
    {
        id : 3,
        name : "meet's project",
        userId : 3
    }
]

module.exports = {ROLE,users,projects}