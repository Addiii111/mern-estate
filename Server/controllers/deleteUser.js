const User = require("../models/user");


const deleteUser = async(req,res) => {
    if (req.user.id !== req.params.id) return res.status(401).json({ message: 'You can delete your account only' })

    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted!') 
    } catch (error) {
        res.status(401).json({ message: error.message })

    }
}

module.exports = deleteUser;