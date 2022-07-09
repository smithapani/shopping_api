const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const validator = require("validator");
const dotenv = require("dotenv");
require('dotenv').config()
const cookieParser = require("cookie-parser");
const {engine} = require("express-handlebars");
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access'); 
require("./db/studentDb");
const Student = require("./models/studentModel");
const studentRoutes = require("./routes/routes");

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine","hbs");
app.set("views", path.join(__dirname, '/views'));
app.engine("hbs",engine({
    extname : "hbs",
    defaultLayout : "mainLayout",
    layoutsDir: __dirname + '/views/layouts',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))

app.use("/", studentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

const addStudentData = async () => {
    
    const student1 = new Student({
        name: "Smit",
        email: "smit@appstonelab.com",
        rollno: 1,
        stype: "Primary",
        active: true,
    })

    const student2 = new Student({
        name: "Bhavin",
        email: "bhavin@appstonelab.com",
        rollno: 2,
        stype: "Primary",
        active: true,
    })

    const student3 = new Student({
        name: "Meet",
        email: "meet@appstonelab.com",
        rollno: 3,
        stype: "Upper Primary",
        active: true,
    })

    const student4 = new Student({
        name: "Arun",
        email: "arun@appstonelab.com",
        rollno: 4,
        stype: "Upper Primary",
        active: true,
    })

    const student5 = new Student({
        name: "Alvin",
        email: "alvin@appstonelab.com",
        rollno: 5,
        stype: "Secondary",
        active: true,
    })
    
    const student6 = new Student({
        name: "Raj",
        email: "raj@appstonelab.com",
        rollno: 7,
        stype: "Higher Secondary",
        active: true,
    })



    const result = await Student.insertMany([student1, student2, student3, student4, student5, student6]);
    console.log(result);
}

//addStudentData();

const getAllStudentsMethod1 = async () => {
    const students = await Student.find();

    console.log(students);
}

//getAllStudentsMethod1();

const getAllStudentsMethod2 = async () => {
    const students = await Student.find({});

    console.log(students);
}

//getAllStudentsMethod2();

const getParticularStudentMethod1 = async (id) => {

    console.log(id);
    
    const student = await Student.findById({_id : id});

    console.log(student);
}

//getParticularStudentMethod1("62b333b62c8b3ee78f6a633c");

const getParticularStudentMethod2 = async (id) => {

    console.log(id);

    const student = await Student.findOne({_id : id});

    console.log(student);
}

//getParticularStudentMethod2("62b333b62c8b3ee78f6a633c");

const updateStudentMethod1 = async (id) => {

    console.log(id);

    const student = await Student.find({ _id: id });

    console.log(student);

    const updatedStudent = await Student.update({ _id : id }, { $set: { active: false } });

    console.log(updatedStudent);
}

//updateStudentMethod1("62b333b62c8b3ee78f6a633c");


const updateStudentMethod2 = async (name) => {

    console.log(name);

    const student = await Student.find({ name: name });

    console.log(student);

    const updatedStudents = await Student.updateMany({ name },{ $set: { active: true } });

    console.log(updatedStudents);
}

//updateStudentMethod2("Smit");


const updateStudentMethod3 = async (id) => {
    console.log(id);

    const student = await Student.findByIdAndUpdate({_id : id},{$set : {name : "Smit"}},{new : true});

    console.log(student);
}

//updateStudentMethod3("62b333b62c8b3ee78f6a633c");


const updateStudentMethod4 = async () => {

    const students = await Student.find({});

    console.log(students);

    console.log(students.length);

    const updatedStudents = await Promise.all(
        students.map((student) => {
            return Student.updateMany({_id : student._id},{$set : {active : "false"}},{new : true});
    }))

    console.log(updatedStudents);

     
}

//updateStudentMethod4(); 


const updateStudentMethod5 = async () => {

    const students = await Student.find({$or : [{name : "Smit"},{stype : "Primary"}]});

    console.log(students);

    const bhavinStudent = students.filter((student) => {
        return student.name == "Bhavin"
    })

    console.log(bhavinStudent);

    
    const updatedBhavin = await Promise.all(bhavinStudent.map((student) => {
        return Student.updateMany({_id : student._id},{$set : {name : "Bh"}},{new : true})
    }))

    console.log(updatedBhavin);
    
}

//updateStudentMethod5();


const removeStudentMethod1 = async () => {

    const student = await Student.findOne({name : "Alvin"});

    console.log(student);

    student.remove();
   
}

//removeStudentMethod1();


const removeStudentMethod2 = async() => {
    const students = await Student.find({$or : [{name : "Raj"},{name : "Arun"}]});

    console.log(students);

    const deletedStudents = await Promise.all(
        students.map((student) => {
            return Student.remove({_id : student._id});
    }))

    console.log(deletedStudents);
}

//removeStudentMethod2();