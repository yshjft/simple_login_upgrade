const express=require('express');
const {isLoggedIn, isNotLoggedIn}= require('./middlewares');

const router=express.Router();

router.get('/',(req, res)=>{
  res.render('index',
    {
      title : 'simple login', 
      user: req.user,
      loginError : req.flash('loginError'),
    });
});

router.get('/join', isNotLoggedIn, (req, res)=>{
  res.render('join', 
    {
      title : 'join',
      joinError : req.flash('joinError'),
    });
});

router.get('/info', isLoggedIn, (req, res)=>{
  res.render('info', 
    {
      title: 'user info & edit',
      user:req.user,
    })
})

module.exports=router;