const express = require("express");
const authController =require('../controllers/auth');
const router = express.Router(); 


router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
      user: req.user
    });
  });
  

router.get('/',(req,res)=>{
    res.render('index');
});
router.get("/register",(req,res)=>{
    
    res.render("register");
});
router.get("/index",(req,res)=>{
     res.render("index");
});
router.get("/portfolioregister",authController.isLoggedIn, (req,res)=>{
    // console.log(req.message);
    
    
    console.log(req.user);
 
    if(req.user){
        
        res.render("portfolioregister");
    }
    else{
        res.redirect('/index');
    }
    
});
router.get("/portfolio",authController.isLoggedIn, (req,res)=>{
    // console.log(req.message);

    
    console.log(req.user);
 
    if(req.user){
        
        res.render("portfolio",{
            user : req.user
        });
    }
    else{
        res.redirect('/index');
    }
    
});



module.exports = router;