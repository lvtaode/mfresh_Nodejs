/**
 * 路由器:封装所有产品相关的路由
 */

const express = require('express');
const pool = require('../pool');
let router = express.Router();
module.exports = router;


/**
 *根据产品ID返回产品详情
 *请求参数：
 pid-产品ID，必需
 *输出结果：
 {
   "pid": 1,
   "title1":"xxx",
   ...
 }
 */

router.get('/detail',(req,res)=>{
  let pid = req.query.pid;
   if(!pid){
     return;
   }else{
     pid=parseInt(pid);
   }
   pool.query('SELECT * FROM mf_product WHERE pid = ?',[pid],(err,result)=>{
     if(err) throw err;
     if(result.length === 0){
       result[0] = {"你好":"您的操作有误"};
     }
     res.json(result[0]);
   })
});

/**
*分页获取产品信息
*请求参数：
  pageNum-需显示的页号；默认为1
type-可选，默认为1
*输出结果：
  {
    totalRecord: 37,
          pageSize: 6,
        pageCount: 7,
        pageNum: 1,
        type: 1,
        data: [{},{} ... {}]
  }
*/

router.get('/select',(req,res)=>{
  let pageNum = req.query.pageNum;
  let type = req.query.type;
  if(!pageNum){
    pageNum = 1
  }else{
    pageNum =parseInt(pageNum)
  };
  if(!type){
    type = 1;
  }else{
    type=parseInt(type);
  };
  let output = {
    totalRecord: 0,
    pageSize: 3,
    pageCount: 0,
    pageNum,
    type,
    data: []
  };
  pool.query('SELECT COUNT(*) AS c FROM mf_product WHERE type=?',[type],(err,result)=>{
    if(err) throw err;
    output.totalRecord = result[0].c;
    output.pageCount = Math.ceil(output.totalRecord/output.pageSize);
    let sql = "SELECT * FROM mf_product WHERE type=? ORDER BY pid DESC LIMIT ?,?";
    let start = (output.pageNum-1)*output.pageSize;
    pool.query(sql,[type,start,output.pageSize],(err,result)=>{
      if(err) throw err;
      output.data = result[0];
      res.json(output);
    })
  });
});