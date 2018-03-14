/**
 * 路由器:封装购物车相关的所有路由
 */

const express = require('express');
const pool = require('../pool');
let router = express.Router();
module.exports = router;

/*
* POST /cart/detail/add
*向购物车中添加商品
* 请求参数:
*  uid - 用户 id, 必须
*  pid - 产品 id, 必须
* 输出结果
* {"code":"1","msg":"success","productCount":1}
* 或
* {"code":400}
*
*  */
router.post('/detail/add',(req,res)=>{
  let uid = req.query.uid;
  let pid = req.query.pid;
  //查看指定用户是否有购物车，无则创建，获取到购物车编号
  let sql = "SELECT cid FROM mf_cart WHERE userId=?";
  pool.query(sql,[uid],(err,result)=>{
    if(err) throw err;
    let cid = "";
    console.log(result);
    if(result.length>0){
      //购物车存在
      // console.log(result[0].cid);
       cid = result[0].cid;
    }else{
      //购物车不存在
      let sql = "INSERT INTO mf_cart VALUES(NULL,?)";
      pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        cid = result.insertId;
      })
    }
    console.log(cid);
    //判断购物车详情表中是否已经存在该商品
    let sql = "SELECT did,count FROM mf_cart_detail WHERE cartId=? AND productId=?";
    pool.query(sql,[cid,pid],(err,result)=>{
      if(err) throw err;
      let count = 1;
      console.log(result);
      let sql = "";
      let after = false;
      if(result.length>0){
        //之前添加过该商品, 则商品数量加1
        count = parseInt(result[0].count);
        count++;
        sql = "UPDATE mf_cart_detail SET count=count WHERE cartId="+cid+" AND productId="+pid;
        after = true;
      }else{
        //之前没有添加过该商品
        sql ="INSERT INTO mf_cart_detail VALUES(NULL,"+cid+","+pid+","+count+")";
        after=true;
      }
      if(after){
        pool.query(sql,(err,result)=>{
          if(err) throw err;
          if(result.affectedRows>0){
            res.json({"code":"1","msg":"success","productCount":count});
          }else{
            res.json({"code":400});
          }
        })
      }
    });
  })
});
/**
 *POST /cart/detail/delete
 *
 *根据购物车详情记录编号删除该购买记录
 *请求参数：
 *  did-详情记录编号
 *输出结果：
 *  {"code":1,"msg":"success"}
 *  或
 *  {"code":400}
 */
router.post('/detail/delete',(req,res)=>{
  let did = req.query.did;
  if(!did){
    res.json({"code":400});
    return;
  };
  let sql = "DELETE FROM mf_cart_detail WHERE did=?";
  pool.query(sql,[did],(err,result)=>{
    if(err) throw err;
    if(result.affectedRows>0){
     res.json({"code":1,"msg":"success"});
    }else{
      res.json({"code":400});
    }
  })
});

/**
 *GET /cart/detail/select
 *
 *查询指定用户的购物车内容
 *请求参数：
 uid-用户ID，必需
 *输出结果：
 {
   "uid": 1,
   "products":[
     {"pid":1,"title1":"xxx","pic":"xxx","price":1599.00,"count":3},
     {"pid":3,"title1":"xxx","pic":"xxx","price":1599.00,"count":3},
     ...
     {"pid":5,"title1":"xxx","pic":"xxx","price":1599.00,"count":3}
   ]
 }
 */

router.get('/detail/select',(req,res)=>{
  let uid = req.query.uid;
  let output = {
    "uid": uid,
    "products":[]
  }
  let sql = "SELECT pid,title1,pic,price,count,did FROM mf_product,mf_cart_detail WHERE mf_cart_detail.productId=mf_product.pid AND pid IN (SELECT productId FROM mf_cart_detail WHERE cartId=(SELECT cid FROM mf_cart WHERE userId=?)) AND mf_cart_detail.cartId=(SELECT cid FROM mf_cart WHERE userId=?)";
  pool.query(sql,[uid,uid],(err,result)=>{
    if(err) throw err;
    output['product'] = result;
    res.json(output);
  })

});

/**
 *POST /cart/detail/update
 *根据购物车详情记录编号修改该商品购买数量
 *请求参数：
 did-详情记录编号
 pid-商品编号
 count-更新后的购买数量
 *输出结果：
 * {"code":1,"msg":"succ"}
 * 或
 * {"code":400}
 */

router.post('/detail/update',(req,res)=>{
 let did = req.query.did;
 let pid = req.query.pid;
 let count = req.query.count;
 if(!(did||pid||count)){
   res.json({"code":400});
   return;
 }
 let sql = "UPDATE mf_cart_detail SET count=? WHERE did=? AND pid=?";
 pool.query(sql,[count,did,pid],(err,result)=>{
   if(err) throw err;
   if(result.affectedRows>0){
     res.json({"code":1,"msg":"succ"});
   }else{
     res.json({"code":400});
   }
 })
});