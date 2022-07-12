/*
This file summary:
Array of objects
Array operations

There is only one file:
learning.js
*/

const cars = [{
    car : {
        color : "red"
    },
    engine : {
        color : "red"
    },
    spareparts:{
        color : "white"
    }
}
];

let carresult = cars.map((c) => {
    //console.log(c);
});

//console.log(carresult);

let test = [ 
    {name:'test',lastname:'kumar',age:30},
    {name:'test',lastname:'kumar',age:30},
    {name:'test3',lastname:'kumar',age:47},
    {name:'test',lastname:'kumar',age:28},
    {name:'test4',lastname:'kumar',age:30},
    {name:'test',lastname:'kumar',age:29}
]

let namesresult = test.map((t) => {
    //console.log(t);
});

//console.log(namesresult);

let computer = {
    key : 1,
    value : "mac",
    enum : ["monitor","mouse","keyboard"]
}

computer.enum.map((c) => {
    //console.log(c);
})

computer.enum.forEach(element => {
    //console.log(element);
});

const pushreturn = test.push({
    name : "test7",
    lastname: "kumarpal",
    age : 30
})

//console.log(pushreturn);
//console.log(test);


const popreturn = test.pop();

//console.log(popreturn);
//console.log(test);

const unshiftresult = test.unshift({
    name : "test7",
    lastname: "kumarpal",
    age : 30
})

//console.log(unshiftresult);
//console.log(test);


const shiftresult = test.shift({
    name : "test7",
    lastname: "kumarpal",
    age : 30
})

//console.log(shiftresult);
//console.log(test);

const spliceresult = test.splice(2,1,{name : "test7",lastname: "kumarpal",age : 30});

//console.log(spliceresult);
//console.log(test);

const sliceresult = test.slice(1,3);

//console.log(sliceresult);
// console.log(test);