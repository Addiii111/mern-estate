

const signOut = (req,res) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!')
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

module.exports = signOut