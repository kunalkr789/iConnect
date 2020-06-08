const express=require('express');

// using express route
const router=express.Router();

const freindController = require('../controllers/friendship_controller');



router.get('/add', freindController.add);





module.exports=router;