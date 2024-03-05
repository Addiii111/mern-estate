const Listing = require("../models/Listing")


const createList = async (req,res) => {

        try {
            const listing = await Listing.create(req.body)
            res.status(200).json(listing)
        } catch (error) {
            res.status(401).json({ message: error.message })
        }
}

module.exports = createList