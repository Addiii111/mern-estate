const express = require('express')
const app = express()
const router = require("./routers/routes.js");
require("./db/conn.js");

app.use(express.json());
app.use(express.urlencoded());

app.use(router);

app.listen(3001, () => {
    console.log('Listening on port 3000');
})
