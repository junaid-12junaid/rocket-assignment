let express=require('express')
let router=express.Router()
let db=require("../db")

const { createCertificate ,updateCertificate,getAllCertificates,getAllUsersCert} = require('../controllers/admin')

router.post("/createCertificate",createCertificate)
router.put("/updateCertificate",updateCertificate)
router.get("/getAllCertificates",getAllCertificates)
router.get("/getAllUsersCert",getAllUsersCert)
module.exports=router