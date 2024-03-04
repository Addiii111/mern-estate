const User = require("../models/user");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const OAuth = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });

        // console.log(user);

        if (!user) {
            // if user doens not exist then we create a new one and store into db 
            // generate a new password
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashPassword = bcrypt.hashSync(generatePassword, 10);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase()
                    + Math.random().toString(36).slice(-4), email: req.body.email, password: hashPassword,
                avatar: req.body.photo

            })

            await newUser.save()

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY)
            const { password: pass, ...rest } = newUser._doc;

            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
        } else {
            // if user already exists so we create token and store into cookie
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
            const { password: pass, ...rest } = user._doc;
            
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
        }
    } catch (error) {
        res.status(401).json({ error: "error" });
    }
}


module.exports = OAuth