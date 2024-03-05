const Listing = require("../models/Listing")


const getListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)

        if (!listing) {
            return res.status(404).json({ message: "Listing not found!" })
        }

        res.status(200).json(listing)
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

module.exports = getListing