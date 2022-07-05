const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ShoppingDB", { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log("Mongodb connection succeded");
    }
    else {
        console.log("There is error in connection");
    }
})