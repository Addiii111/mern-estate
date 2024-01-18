const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require("./routers/routes.js");
require("./db/conn.js");


app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(router);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.listen(3001, () => {
    console.log('Listening on port 3001');
})
