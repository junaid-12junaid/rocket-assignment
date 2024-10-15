let db=require('../db')
const { isValid, isUrlValid, validateDate, isValidNum } = require('../validators/validation')

let moment=require('moment')
async function  createCertificate(req,res){
    try {

        let { cert_code, cert_name, issuer, overview, start_date, duration, status}=req.body

if(!isValid(cert_code)) return res.status(400).send({status:false,message:"cert_code is mandatory and should have non empty string"})
if(!isValid(cert_name)) return res.status(400).send({status:false,message:"certificate name cert_name is mandatory and should have non empty string"})
if(!isValid(issuer)) return res.status(400).send({status:false,message:"issuer is mandatory and should have non empty string"})

    if(!isUrlValid(issuer)) return res.status(400).send({status:false,message:"issuer url should be in valid format"})

if(!isValid(overview)) return res.status(400).send({status:false,message:"overview is mandatory and should have non empty string"})
if(!isValid(start_date)) return res.status(400).send({status:false,message:"start_date code is mandatory and should have non empty string"})

if(!validateDate(start_date)) return res.status(400).send({status:false,message:"start_date should be in valid format YYYY-MM-DD"})

if(!isValidNum(duration)) return res.status(400).send({status:false,message:"duration is mandatory and should have number"})

    

if(!isValid(status)) return res.status(400).send({status:false,message:"status is mandatory and should have non empty string and it should be draft or published"})

    if(status!=='draft'&&status!=='published') return res.status(400).send({status:false,message:"status should be draft or published"})

        const endDate = moment(start_date).add(duration, 'month'); // Add 1 month


const formattedEndDate = endDate.format('YYYY-MM-DD');



let query=`insert into certificates( cert_code, cert_name, issuer, overview, start_date, end_date, status) values ('${cert_code}','${cert_name}','${issuer}','${overview}','${moment(start_date).format("YYYY-MM-DD")}','${formattedEndDate}','${status}')`
await db.query(query)

        return res.status(201).send({
            status:true,message:"The certificate is created successfully"
        })
        

    } catch (error) {

        console.error("Server error",error)
        return res.send({
            statuscode:500,
            "message":"Server error",
            "error":error
        })
    }
}

async function updateCertificate(req,res) {

    try {
        let { cert_id,cert_code, cert_name, issuer, overview, start_date, duration, status}=req.body

    if(!isValid(cert_id)) return res.status(400).send({status:false,message:"cert_id is mandatory and should have non empty string"})

    let findCertificcate=await db.query(`select * from certificates where id=${cert_id}`)

    if(findCertificcate.length==0) return res.status(404).send({status:false,message:"There is no certificate with provided cert_id"})
        findCertificcate=findCertificcate[0]

    if(findCertificcate[0].status=='published') return res.status(400).send({status:false,message:"This certificate is already published you can't update "})
        
    let updateObj={
         cert_code:findCertificcate[0].cert_code, cert_name:findCertificcate[0].cert_name, issuer:findCertificcate[0].issuer, overview:findCertificcate[0].overview, start_date:findCertificcate[0].start_date, end_date:findCertificcate[0].end_date, status:findCertificcate[0].status
    }
    
    if(isValid(cert_code)) {
        updateObj.cert_code=cert_code
    }
    if(isValid(cert_name)) {
        updateObj.cert_name=cert_name
    }
    if(isValid(issuer)) {
        

        if(!isUrlValid(issuer)) return res.status(400).send({status:false,message:"issuer url should be in valid format"})

            updateObj.issuer=issuer
    }

    if(isValid(overview)) {
        updateObj.overview=overview
    }

        if(isValid(start_date)){

            if(!validateDate(start_date)) return res.status(400).send({status:false,message:"start_date should be in valid format YYYY-MM-DD"})

        updateObj.start_date=start_date
        }
        
       
        
        if(isValidNum(duration)) {

            if(isValid(start_date)){
                const endDate = moment(start_date).add(duration, 'month'); // Add 1 month
        
            
            const formattedEndDate = endDate.format('YYYY-MM-DD');
        updateObj.end_date=formattedEndDate

            }else{
                const endDate = moment(findCertificcate[0].start_date).add(duration, 'month'); // Add 1 month
        
            
                const formattedEndDate = endDate.format('YYYY-MM-DD');
        updateObj.end_date=formattedEndDate

            }
        }

        
        
            
        
        if(isValid(status)){
            if(status!=='draft'&&status!=='published') return res.status(400).send({status:false,message:"status should be draft or published"})

        updateObj.status=status

        }


        await db.query(`update certificates set  cert_code='${updateObj.cert_code}', cert_name='${updateObj.cert_name}', issuer='${updateObj.issuer}', overview='${updateObj.overview}', start_date='${updateObj.start_date}', end_date='${updateObj.end_date}', status='${updateObj.status}' where id=${cert_id}`)

        return res.status(200).send({
            status:true,
            message:"Updated the certificate succesfully"
        })
    } catch (error) {
        console.error("Server error",error)
        return res.send({
            statuscode:500,
            "message":"Server error",
            "error":error
        }) 
    }
    


               
}

async function getAllCertificates(req,res) {

    try {
        let {dates,end_date,start_date,cert_name,order,no_users,status}=req.query

        let date="",isCert="",num_users=""

        if(isValid(start_date)){

            if(!isValid(end_date)) return res.status(400).send({status:false,message:"end_date and start_date should not be empty"}) 

            if(!validateDate(start_date)&&!validateDate(end_date)) return res.status(400).send({status:false,message:"start_date and end_date should be in valid format YYYY-MM-DD"})


    date=`where c.start_date>='${moment(start_date).format('YYYY-MM-DD')}' and c.end_date <='${moment(end_date).format('YYYY-MM-DD')}'` 

            }

            if(isValid(cert_name)){
                if(!isValid(order)) return res.status(400).send({status:false,message:"order is madatory and the values should be desc or asc"}) 

                    isCert=`order by c.cert_name ${order}`
                
            }

            if(isValid(no_users)){
                if(!isValid(order)) return res.status(400).send({status:false,message:"order is madatory and the values should be desc or asc"}) 

                    num_users=`order by user_count ${order}`
                
            }

let query=`select c.id,c.cert_name,c.status,c.start_date,c.end_date,count(uc.user_id) as user_count from certificates c left join users_certificate uc on c.id=uc.cert_id ${date} group by c.id ${isCert} ${num_users}`

let allCert=await db.query(query)

if(allCert.length>0){
    allCert=allCert[0]

   for(let i of allCert){
    if(i.status=='published'){
        let startdate=moment(i.start_date,"YYYY-MM-DD",true)
        let enddate=moment(i.end_date,"YYYY-MM-DD",true)
        let today=moment().format("YYYY-MM-DD")
        if(startdate.isSameOrBefore(today)&&enddate.isSameOrAfter(today)){
            i.status='active'
        }else{
            i.status='expired'
        }
    }
   }

   if(isValid(status)){
    if(status=='draft') allCert=allCert.filter(x=>x.status=='draft')
    if(status=='published') allCert=allCert.filter(x=>x.status=='published')
    if(status=='active') allCert=allCert.filter(x=>x.status=='active')
    if(status=='expired') allCert=allCert.filter(x=>x.status=='expired')
   }
}

        return res.status(200).send({
            status:true,
            message:"The data of all certificates",
            result:allCert
        })
    } catch (error) {
        console.error("Server error",error)
        return res.send({
            statuscode:500,
            "message":"Server error",
            "error":error
        }) 
    }
    


               
}

async function getAllUsersCert(req,res) {

    try {
        let {cert_id}=req.query

        if(!isValid(cert_id)) return res.send({message:"cert_id is mandatory"})

            let findCert=await db.query(`select u.* from users_certificate uc left join users u on u.user_id=uc.user_id where uc.cert_id=${cert_id}`)
            findCert=findCert[0]

        return res.status(200).send({
            status:true,
            message:"The data of users in this certificate",
            result:findCert
        })
    } catch (error) {
        console.error("Server error",error)
        return res.send({
            statuscode:500,
            "message":"Server error",
            "error":error
        }) 
    }
    


               
}



module.exports={createCertificate,updateCertificate,getAllCertificates,getAllUsersCert}