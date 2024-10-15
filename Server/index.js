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

// Allow requests from specific origins (your production URL)
const allowedOrigins = [process.env.FRONTEND_URL];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.listen(3001, () => {
    console.log('Listening On Port 3001');
})
