const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner.js')

router.get('/get',async(req,res)=>{
    try {
        const banners = await Banner.find()
        res.json(banners)
    } catch (error) {
        res.json(error).status(500)
    }
})

router.post('/add',async(req,res)=>{
    try {
        const banners = new Banner(req.body)
        await banners.save()
        res.json(banners)
    } catch (error) {
        res.json(error).status(500)
    }
})
router.put('/update',async(req,res)=>{

    try {
        const banners = await Banner.findByIdAndUpdate(req.body._id,req.body,{new:true})
        res.json(banners)
    } catch (error) {
        res.json(error).status(500)
    }
})
router.delete('/del',async(req,res)=>{

    try {
        const banners = await Banner.findByIdAndDelete(req.body._id)
        res.json(banners)
    } catch (error) {
        res.json(error).status(500)
    }
})


module.exports = router;