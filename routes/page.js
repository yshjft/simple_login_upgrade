const express=require('express');
const {isLoggedIn, isNotLoggedIn}= require('./middlewares');
const {User}=require('../models');

const router=express.Router();

router.get('/',async(req, res)=>{
  const _users=await User.findAll({
    attributes :['email', 'nick'],
  });

  res.render('index',
    {
      title : 'simple login', 
      user: req.user,
      loginError : req.flash('loginError'),
      users: _users,
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
    });
});

router.get('/change_password', isLoggedIn, (req, res)=>{
  res.render('changePWD', {
    title : 'change_pwd',
    user:req.user,
  });
});

module.exports=router;