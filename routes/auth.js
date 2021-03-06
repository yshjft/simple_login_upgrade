const express=require('express');
const passport=require('passport');
const bcrypt=require('bcryptjs');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');
const {User}=require('../models');

const router=express.Router();
router.post('/join', isNotLoggedIn, async(req, res, next)=>{
  const {email, nick, password}= req.body;
  try{
    const exUser= await User.findOne({ where : {email}});
    if(exUser){
      req.flash("loginError", "이미 가입된 이메일입니다.");
      return res.redirect('/join');
    }
    const hash= await bcrypt.hash(password, 12);

    await User.create({
      email,
      nick,
      password : hash,
    });
    return res.redirect('/');
  }catch(error){
    console.error(error);
    return next(errror);
  }  
});

router.post('/login', isNotLoggedIn, (req, res, next)=>{
  passport.authenticate('local', (authError, user, info)=>{
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if(!user){
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError)=>{
      if(loginError){
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res)=>{
  req.logOut();
  req.session.destroy();
  res.redirect('/');
});

router.patch('/edit', isLoggedIn, async(req, res, next)=>{
  const {email, nick}=req.body;

  if(req.user.email !== email){
    let exUser=await User.findOne({where : {email}});
    if(exUser){
      return res.status(509).send('이미 사용중인 이메일입니다.');
    }
  }
  User.update({email : req.body.email, nick : req.body.nick}, {where : {id : req.user.id}})
    .then(result=>{
      res.send('변경 성공');
    })
    .catch(error=>{
      console.error(error);
      next(error);
    });
});

router.delete('/remove', isLoggedIn, (req, res, next)=>{
  User.destroy({where : {id: req.user.id}})
  .then(result =>{
    req.logOut();
    req.session.destroy();
    res.json(result);
  })
  .catch(error=>{
    console.error(error);
    next(error);
  });
});

router.patch('/changePWD', isLoggedIn, async(req, res, next)=>{
  const {password}=req.body;
  const hash=await bcrypt.hash(password, 12);

  console.log(hash);

  User.update({password : hash}, {where : {id : req.user.id}})
    .then(result =>{
      res.json(result);
    })
    .catch(error=>{
      console.error(error);
      next(error);
    })

});

module.exports=router;