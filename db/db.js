const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ShoppingDB2",{
    useNewUrlParser : true,
    useUnifiedTopology : true
},(err) => {
    if(!err){
        console.log("mongodb connection succeded");
    }
    else{
        console.log("There is error in mongodb connection",err.message);
    }
})