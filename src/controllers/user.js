let db=require('../db')

const { isValid, isUrlValid, validateDate, isValidNum, isvalidEmail } = require('../validators/validation')

let moment=require('moment')
async function getActiveCertificates(req,res) {

    try {
        let {end_date,start_date,cert_name,order,email,name}=req.query
let date="",isCert=""

var user_id1=0


if(!isValid(email)) return res.status(400).send({status:false,message:"email is mandatory"}) 

    if (!isvalidEmail.test(email)) return res.status(400).send({ status: false, message: "email should be in  valid Formate" })


        if(isValid(start_date)){

            if(!isValid(end_date)) return res.status(400).send({status:false,message:"end_date and start_date should not be empty"}) 

            if(!validateDate(start_date)&&!validateDate(end_date)) return res.status(400).send({status:false,message:"start_date and end_date should be in valid format YYYY-MM-DD"})


    date=`where c.start_date>='${moment(start_date).format('YYYY-MM-DD')}' and c.end_date <='${moment(end_date).format('YYYY-MM-DD')}'` 

            }

            if(isValid(cert_name)){
                if(!isValid(order)) return res.status(400).send({status:false,message:"order is madatory and the values should be desc or asc"}) 

                    isCert=`order by c.cert_name ${order}`
                
            }


            let findUser=await db.query(`select * from users where email='${email}'`)
            findUser=findUser[0]
            if(findUser.length>0){
                

                user_id1=findUser[0].user_id
            }else{
                if(!isValid(name)) return res.status(400).send({status:false,message:"name is mandatory"}) 

                    await db.query(`insert into users(name,email) values ('${name}','${email}')`)

                    let findUser1=await db.query(`select * from users where email='${email}'`)
                    findUser1=findUser1[0]
                    user_id1=findUser1[0].user_id
            }


let query=`select c.id,c.cert_name,c.status,c.start_date,c.end_date,count(uc.user_id) as user_count from certificates c left join users_certificate uc on c.id=uc.cert_id ${date} group by c.id ${isCert}`

let allCert=await db.query(query)
var result1=[]

if(allCert.length>0){
    allCert=allCert[0]


   for(let i of allCert){
    if(i.status=='published'){
        let startdate=moment(i.start_date,"YYYY-MM-DD",true)
        let enddate=moment(i.end_date,"YYYY-MM-DD",true)
        let today=moment().format("YYYY-MM-DD")
        if(startdate.isSameOrBefore(today)&&enddate.isSameOrAfter(today)){
            i.status='active'
            
            result1.push(i)

            let findEnrolled=await db.query(`select * from users_certificate where user_id=${user_id1} and cert_id=${i.id}
                `)

                findEnrolled=findEnrolled[0]
                if(findEnrolled.length>0){
                    
                        i.isEntrolled=true
                    }else{
                        i.isEntrolled=false
                        
                    }
                
            
        }
    }
   }

   
}

        return res.status(200).send({
            status:true,
            message:"The data of all active certificates",
            result:result1
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


async function enrollCert(req,res) {

    try {
        let {email,cert_id}=req.body
var user_id=0
        if(!isValid(email)) return res.status(400).send({status:false,message:"email should not be empty"}) 

            if (!isvalidEmail.test(email)) return res.status(400).send({ status: false, message: "email should be in  valid Formate" })

        if(!isValid(cert_id)) return res.status(400).send({status:false,message:"cert_id should not be empty"}) 


        let findUser1=await db.query(`select * from users where email='${email}'`)
        findUser1=findUser1[0]
        if(findUser1.length>0){
            
           user_id= findUser1[0].user_id
        }
        

let findEnrolled=await db.query(`select * from users_certificate where user_id=${findUser1[0].user_id} and cert_id=${cert_id}`)

if(findEnrolled[0].length>0){
    return res.status(400).send({status:false,message:"You already enrolled to this certificate"})
}

await db.query(`insert into users_certificate(user_id,cert_id) value(${findUser1[0].user_id},${cert_id})`)

        return res.status(200).send({
            status:true,
            message:"Enrollment is done to this certificate"
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


    

module.exports={getActiveCertificates,enrollCert}