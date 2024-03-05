const Listing = require("../models/Listing")


const deleteListing = async (req,res) => {

    const listing = await Listing.findById(req.params.id)

    if(!listing) {
        return res.status(404).json({message: "Listing not found!"})
    }

    if(req.user.id !== listing.userRef){
        return res.status(404).json({message: "You can delete your own listing!"})
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been deleted!')
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

module.exports = deleteListing