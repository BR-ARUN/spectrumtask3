var mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
// const { runInNewContext } = require('vm');


var con=mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER ,
    password: process.env.DATABASE_PASSWORD,
    
  database: process.env.DATABASE
});
exports.login = async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

    if( !email || !password  ){
        return res.status(400).render('index',{
            message:'Please provide an email and password'
        })
    }

  
    // con.query("select * from customers where email = ? and passw = ?",[email,password],function(error,results,fields){
        con.query("select * from customers where email = ? and passw = ?",[email,password],function(error,results,fields){
                    if (results.length > 0) {
                      
                      const id =results.id;
                      const token=jwt.sign({id: id},process.env.JWT_SECRET, {
                          expiresIn:process.env.JWT_EXPIRES_IN 
                      });
                      console.log(" the token is: " + token );
                      const cookieOptions ={
                          expires: new Date(
                              Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                          ),
                          httpOnly: true
                      }
                      res.cookie('jwt',token, cookieOptions);
                      res.status(200).redirect("portfolioregister");
                    } else {
                        res.status(401).render('index',{
                            message:'EMAIL or PASSWORD is incorrect'
                        })
                    }
                    res.end();
                })
            // })




    }catch(error){
       console.log(error); 
    }


}


exports.register=(req,res)=>{
    console.log(req.body);


 //const { name, email, phno, branch, year, domain, password ,confirmPassword}=req.body;

 const name=req.body.fname;
 const email=req.body.email;
 const phno=req.body.number;
 const branch=req.body.branchs;
 const year=req.body.years;
 const domain=req.body.domains;
 const password=req.body.password;
 const confirmPassword=req.body.cpassword;


   con.query("SELECT email FROM customers WHERE email=?",[email],(error,results)=>{
       if(error){
           console.log(error);

       }
       if(results.length > 0){
           return res.render('register',{
               message:'That email is already in use'
           })
       }
       else if(password !== confirmPassword){
        return res.render('register',{
            message:'Passwords do not match'
        });

       }
      
    //  let hashedPassword = await bcrypt.hash(password, 8);
    
    //  console.log(hashedPassword);
    con.query('INSERT INTO customers SET ?', {name: name, email: email, mbno: phno, branch:branch, year:year, domain:domain, passw:password },(error,results)=>{
if(error){
    console.log(error);
    }
    else{
        console.log(results);
        return res.render('register',{
            message:'User registered'
        });
    }
    })

   });


    
   
}

exports.portfolioregister=(req,res)=>{
    console.log(req.body);


 const { fullname, profession, skill1, skill2, skill3, skill4, skill5, per1,per2, per3,per4,per5 ,prjimg1,prjname1,prjdes1,prjimg2,prjname2,prjdes2,prjimg3,prjname3,prjdes3}=req.body;





    con.query('INSERT INTO customers SET ?', {fullname:fullname,  profession:  profession,skill1:skill1, skill2:skill2, skill3:skill3, skill4:skill4, skill5:skill5, per1:per1,per2:per2, per3:per3,per4:per4,per5 :per5,prjimg1:prjimg1,prjname1:prjname1,prjdes1:prjdes1,prjimg2:prjimg2,prjname2:prjname2,prjdes2:prjdes2,prjimg3:prjimg3,prjname3:prjname3,prjdes3:prjdes3 },(error,results)=>{

 

   });


    
   
}







exports.isLoggedIn = async (req,res,next)=>{
    // req.message="Inside middleware";
    console.log(req.cookies);
    next();
    if(req.cookies.jwt){
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
        console.log(decoded);
        console.log("im here in decoded");

        con.query('select * from customers where id= ?',[decoded.id], (error,result)=>{
            console.log(result);
            if(!result)
            {
                return next();
            }
            req.user =result[0];
            return next();
        });
        
    
    } catch (error) {
            return next();
        }
    }
    else{
        next();
    }
}