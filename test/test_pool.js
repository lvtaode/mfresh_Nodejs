const pool = require('../pool');


let sql = "SELECT * FROM mf_user";
pool.query(sql,[],(err,result)=>{
  if(err) throw err;
  console.log(result);
});