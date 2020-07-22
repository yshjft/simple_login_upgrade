const express=require('express');

const router=express.Router();

router.get('/',(req, res)=>{
  res.render('index', 
    {
      title : 'simple login', 
      user: null,
      loginError : null
    });
});

router.get('/join', (req, res)=>{
  res.render('join', 
    {
      title : 'simple login_join',
      joinError : null
    });
});

module.exports=router;