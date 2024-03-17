const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connection Established"))
    .catch((err) => {
        console.log("Connection failed " + err);
        process.exit(1);
    });   