let express=require('express')
let router=express.Router()
let db=require("../db")
const { getActiveCertificates ,enrollCert} = require('../controllers/user')

router.get("/getActiveCertificates",getActiveCertificates)
router.post("/enrollCert",enrollCert)

module.exports=router