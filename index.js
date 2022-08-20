const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./db/db");
const userRouter = require("./routes/routes");

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use("/",userRouter);

app.listen(port,() => {
    console.log(`Server will run on port ${port}`);
})