const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();


const auth = (req, res, next) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized Access' })
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Forbidden'
            })
        }

        req.user = user
        next()
    })
}

module.exports = auth