const express = require('express')
const app = express()

require("./db/conn.js");

app.listen(3000, () => {
    console.log('Listening on port 3000');
})
