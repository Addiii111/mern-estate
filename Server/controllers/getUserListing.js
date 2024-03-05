const Listing = require("../models/Listing")


const getUserListing = async (req,res) => {

    if (req.user.id !== req.params.id) 
       return res.status(401).json({message:'You can only view your own listings'})

    try {
        const listings = await Listing.find({userRef:req.params.id})
        res.status(200).json(listings)
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

module.exports = getUserListing