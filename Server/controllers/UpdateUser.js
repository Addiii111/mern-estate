const bcrypt = require('bcryptjs')
const User = require('../models/user')

const updateUser = async (req, res) => {


    if (req.user.id !== req.params.id) return res.status(401).json({ message: 'You can update your account only' })

    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })

        const { password, ...rest } = updatedUser._doc

        res.status(200).json(rest)

    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

module.exports = updateUser