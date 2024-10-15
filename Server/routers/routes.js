const express = require('express');
const test = require('../controllers/test.js');
const signup = require('../controllers/signup.js');
const signin = require('../controllers/signin.js');
const OAuth = require('../controllers/OAuth.js');
const updateUser = require('../controllers/UpdateUser.js');
const auth = require('../middlewares/auth.js');
const deleteUser = require('../controllers/deleteUser.js');
const signOut = require('../controllers/signOut.js');
const createList = require('../controllers/createList.js');
const getUserListing = require('../controllers/getUserListing.js');
const deleteListing = require('../controllers/deleteListing.js');
const updateListing = require('../controllers/updateListing.js');
const getListing = require('../controllers/getListing.js');
const getUser = require('../controllers/getUser.js');
const getListings = require('../controllers/getListings.js');

const {exec} = require('child_process');
const router = new express.Router();


router.get('/test', test)
router.post('/api/signup', signup)
router.post('/api/signin', signin)
router.post('/api/google', OAuth)
router.get('/api/signOut', signOut)


router.post('/api/updateUser/:id', auth, updateUser)
router.delete('/api/deleteUser/:id', auth, deleteUser)

// Listing API's
router.post('/api/createList', auth, createList)
router.get('/api/listings/:id',auth,getUserListing)
router.delete('/api/deleteListing/:id',auth,deleteListing)
router.post('/api/updateListing/:id', auth, updateListing)
router.get('/api/getListing/:id', getListing)
router.get('/api/getListings', getListings)

router.get('/api/:id',auth,getUser)
router.get('/api/recommend/:propertyId',(req,res)=>{
    const {propertyId}=req.params

    exec(`python3 ./recommendation/recommendation.py ${propertyId}` ,(err,stdout,stderr)=>{
        if(err){
            console.error(`Error: ${err.message}`)
            return res.status(500).json({message: 'Error generating recommendation' });
        }
        if(stderr){
            console.error(`Stderr: ${stderr}`)
            return res.status(500).json({message: 'Error in Python script'});
        }

        const recommendation = JSON.parse(stdout.replace(/'/g,'"'));
        res.json(recommendation);
    })
})
module.exports = router;