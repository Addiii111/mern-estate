const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require("./routers/routes.js");
const dotenv = require("dotenv")
dotenv.config();
require("./db/conn.js");


app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(router);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.listen(3001, () => {
    console.log('Listening on port 3001');
})
