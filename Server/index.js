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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://mern-estate-xenon.netlify.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
app.listen(3001, () => {
    console.log('Listening On Port 3001');
})
