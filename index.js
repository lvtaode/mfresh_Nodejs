const http =require('http');
const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routerNews = require('./router/news');
const routerProduct = require('./router/product');
const routerCart = require('./router/cart');
const routerUser = require('./router/user');

let app = express();

http.createServer(app).listen(3000);


/**********中间件***********/
app.use( bodyParser.urlencoded({
  extended:false
}));
app.use(cors({
  origin:['http://127.0.0.1','http://localhost','http://127.0.0.1:63342', 'http://localhost:63342','http://127.0.0.1:8080', 'http://localhost:8080']
}));
app.use(cookieParser());

/***********路由器************/
app.use('/news',routerNews);
app.use('/product',routerProduct);
app.use('/cart',routerCart);
app.use('/user',routerUser);
