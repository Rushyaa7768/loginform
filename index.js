const express = require('express');
const app = express();
const port = 3333;
const conn = require("./db");
const cors = require("cors");
const { urlencoded } = require('body-parser');
const cookieParser = require("cookie-parser")

require("dotenv").config();

conn.connection.on("connected", (err) => {
    if (err) {
        console.log(err);

    } else {
        console.log("database connected")
    }

})

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use("/user", require("./routes/user"));
app.listen(port, () => console.log("server start"));