const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const MainRouter = require("./Routes/MainRouter.js");
const cors = require("cors");
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, ".env") })

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev"));


mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        app.listen(Number(process.env.PORT), () => {
            console.log("Server is running, DB is working correctly");
            app.use(MainRouter);
        });
    })
    .catch((err) => {
        console.log("Server is not running, DB error", err);
    });

