const express = require('express')
const router = express.Router()
const controller=require('../controller/authController')

router.post('/',controller.handlelogin)

module.exports=router
