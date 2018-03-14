/*
* 路由器: 封装新闻相关的所有路由
* */

const express = require('express');
let router = express.Router();
const pool = require('../pool');
module.exports = router;

/*
* GET /news/select
* 按发布时间顺序返回新闻列表
* 请求参数:
* pageNum - 需要显示的页号;默认值 1;
* 输出结果:
* {
*   totalRecord:58,
*   pageSize:10,
*   pageCount:6,
*   pageNum:1,
*   data:[{},{},{},{}]
* }
* */

router.get('/select',(req,res)=>{
  //获取请求数据pageNum
  let pageNum = req.query.pageNum;
  if(!pageNum){
    pageNum=1;
  }else{
    pageNum = parseInt(pageNum);
  }
  let pager = {
    totalRecord:0,
    pageSize:5,
    pageCount:0,
    // pageNum:pageNum
    pageNum,
    data:[]
  };
  pool.query('SELECT COUNT(*) AS c FROM mf_news',(err,result)=>{
    if(err) throw err;
    pager.totalRecord = result[0].c;//总记录数
    pager.pageCount = Math.ceil(pager.totalRecord/pager.pageSize);//总页数
    pool.query('SELECT nid,title,pubTime FROM mf_news ORDER BY pubTime DESC LIMIT ?,?',[(pager.pageNum-1)*pager.pageSize,pager.pageSize],(err,result)=>{
      if(err) throw err;
      pager.data = result;
      res.json(pager);
    });
  });
});


/*
 * GET /news/detail
 * 根据新闻ID返回新闻详情
 * 请求参数：
    nid-新闻ID，必需
 * 输出结果：
   {
     "nid": 1,
     ...
   }
 */

router.get('/detail',(req,res)=>{
  let nid = req.query.nid;
  pool.query('SELECT * FROM mf_news WHERE nid=?',[nid],(err,result)=>{
    if(err) throw err;
    if(result.length === 0){
      result[0] = {"你好":"可能输入有误,没有找到您想要的数据"};
    }
    res.json(result[0]);
  });
});







