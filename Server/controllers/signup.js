const User = require('../models/user.js')
const bcrypt = require('bcryptjs')

const signup = async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const salt = 10;
        const safePassword = bcrypt.hashSync(password, salt);

        const newUser = new User({ username, email, password: safePassword });
        await newUser.save();

        res.status(200).json("user created successfully");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

module.exports = signup;