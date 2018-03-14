/*
* 路由:封装用户相关的所有路由
* */

const express = require('express');
const session = require('express-session');
const pool = require('../pool');
// const session = require('express-session');
let router = express.Router();
module.exports = router;

/**
 *验证电话号码是否已经存在
 *请求参数：
 phone-用户名
 *输出结果：
 * {"code":1,"msg":"exist"}
 * 或
 * {"code":2,"msg":"non-exist"}
 */
router.get('/check/phone',(req,res)=>{
  let phone = req.query.phone;
  if(!phone) return;
  pool.query("SELECT uid FROM mf_user WHERE phone=?",[phone],(err,result)=>{
     if(err) throw err;
     if(result.length === 0){
       res.json({"code":2,"msg":"non-exist"});
     }else{
       res.json({"code":1,"msg":"exist"});
     }
  });
});

/**
 *GET /user/check/uname
 *验证用户名是否已经存在
 *请求参数：
 uname-用户名
 *输出结果：
 * {"code":1,"msg":"exist"}  存在
 * 或
 * {"code":2,"msg":"non-exist"}  不存在
 *
 */

router.get('/check/uname',(req,res)=>{
  let uname = req.query.uname;
  if(!uname) return;
  pool.query("SELECT uid FROM mf_user WHERE uname=?",[uname],(err,result)=>{
    if(err) throw err;
    if(result.length === 0){
      res.json({"code":2,"msg":"non-exist"});
    }else{
      res.json({"code":1,"msg":"exist"});
    }
  });
});
/*
* POST /user/login
* 用户登录验证
* 请求参数:
* uname or upwd 用户名或密码
* 输出结果:
* {"code":1,"uid":1,"uname":"test","phone":"13012345678"}
* 或
* {"code":400}
* */
router.post('/login',(req,res)=>{
  let uname = req.query.uname;
  let upwd = req.query.upwd;
  if(!uname) return;
  if(!upwd) return;
  let sql = "SELECT uid,uname,phone FROM mf_user WHERE uname=? AND upwd=? ";
  pool.query(sql,[uname,upwd],(err,result)=>{
    if(err) throw err;
    if(result.length>0){
      res.json(result[0]);
    }else{
      res.json({"code":400});
    }
  })
});

/**
 *POST /user/register
 *注册新用户
 *请求参数：
 uname-用户名
 upwd-密码
 phone-电话号码
 *输出结果：
 * {"code":1,"uid":3,"uname":"test"}
 * 或
 * {"code":500}
 */

router.post('/register',(req,res)=>{
  let uname = req.query.uname;
  let upwd = req.query.upwd;
  let phone = req.query.phone;
  if(!phone) return;
  let sql = "INSERT INTO mf_user VALUES(NULL,?,md5(?),?)";
  pool.query(sql,[uname,upwd,phone],(err,result)=>{
    if(err) throw err;
    if(result.affectedRows>0){
      res.json({"code":1,"uid":result.insertId,"uname":uname});
    }else{
      res.json({"code":500});
    }
  })
});