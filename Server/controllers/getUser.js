const User = require("../models/user")


const getUser = async (req,res) => {

    try {
        
        const user = await User.findById(req.params.id)
        
        if(!user) return res.status(404).json({message:'User not found!'})
    
        const {password : pass , ...rest} = user._doc
        res.status(200).json(rest)
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
     

}

module.exports = getUser