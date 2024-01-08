const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email: email });
        if (!validUser) return res.status(401).json({ error: 'User not found!' });
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return res.status(401).json({ error: 'Wrong Credentials!' });
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY)
        console.log(validUser);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('accessToken', token, {
            httpOnly: true,
        }).json(rest)


    } catch (error) {
        res.status(401).json({ error: error });
    }

}

module.exports = signin