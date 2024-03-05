const Listing = require("../models/Listing")


const updateListing = async (req,res) => {
    const listing = await Listing.findById(req.params.id)

    if(!listing) {
        return res.status(404).json({message: "Listing not found!"})
    }

    if(req.user.id !== listing.userRef){
        return res.status(401).json({message: "You can only update your own listing!"})
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new : true})
        res.status(200).json(updatedListing)
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

module.exports = updateListing