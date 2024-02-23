const express = require("express");
const mongoose = require("mongoose");

const routes = require('./routes');

const app = express();

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", routes);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;


mongoose.connect(MONGO_URI).then(console.log("MongoDB Connected"));

app.listen(3000, () => {
    console.log(`Server running on port ${PORT}`);
})