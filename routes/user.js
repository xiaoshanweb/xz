const express=require('express');
const bodyParser=require('body-parser');
//引入连接池
const pool=require('../pool.js');
//创建路由器对象
var router=express.Router();
//往路由器中添加路由
//1.用户注册
router.post('/reg',function(req,res){
	//1.1获取post请求的数据
	var str=req.body;
	console.log(str);
	//1.2验证数据是否为空
	if(!str.uname){
		res.send({code:401,msg:'uname require'});
		//阻止往后执行
		return;
	}
	if(!str.upwd){
		res.send({code:402,msg:'upwd require'});
		//阻止往后执行
		return;
	}
	if(!str.phone){
		res.send({code:403,msg:'phone require'});
		//阻止往后执行
		return;
	}
	if(!str.email){
		res.send({code:404,msg:'email require'});
		//阻止往后执行
		return;
	}
	//1.3执行SQL语句 判断是否成功
	pool.query('insert into xz_user set?',[str],function(err,result){
		if(err) throw err;
		console.log(result);
		if(result.affectedRows > 0){
			res.send({code:200,msg:'reginster success'});
		}
	});   
});
//2.用户登录
router.post('/login',function(req,res){
	var str=req.body;
	console.log(str);
	//验证数据是否为空
	if(!str.uname){
		res.send({code:401,msg:"uname require"});
		return;
	}
	if(!str.upwd){
		res.send({code:401,msg:"uname require"});
		return;
	}
	pool.query('select * from xz_user where uname=? and upwd=?',[str.uname,str.upwd],function(err,result){
		if(err) throw err;
		console.log(result);
		if(result.length>0){
			res.send({code:200,msg:'login success'});
		}else{
			res.send({code:403,msg:'登录失败'});
		}
	} );
});
//3.用户详情
router.get('/detail',function(req,res){
	var str=req.query;
	console.log(str);
	if(!str.uid){
		res.send({code:401,msg:'uid require'});
		return;
	}
	pool.query('select * from xz_user where uid=?',[str.uid],function(err,result){
		if(err) throw err;
		//判断是否检索到用户，如果检索到，把该用户的对象响应到浏览器
		if(result.length>0){
			res.send(result[0]);
		}else{
			res.send({code:301,msg:'未检索到用户'});
		}
	});
});
//4.修改用户
router.get('/update',function(req,res){
	var str=req.query;
	//console.log(str);
	var i=400;
	for(var key in str){
		i++;
		//console.log(str[key]);
		if(!str[key]){
			res.send({code:i,msg:key+'  require'});
			return;
		}
	}//SET name = 'zhang', score = '97' WHERE sid='4';
	/*pool.query('update xz_user set email=?,phone=?,user_name=?,gender=? where uid=?',[str.email,str.phone,str.user_name,str.gender,str.uid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			pool.query('select * from xz_user where uid=?',[str.uid],function(err,result){
				if(err) throw err;
				res.send(result[0]);
				console.log(result);
			});
		}else{
			res.send('查询不到该用户');
		}
	});*/
	pool.query('update xz_user set ? where uid=?',[str,str.uid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			pool.query('select * from xz_user where uid=?',[str.uid],function(err,result){
				if(err) throw err;
				res.send(result[0]);
				console.log(result);
			});
		}else{
			res.send({code:401,msg:'查询不到该用户'});
		}
	});
});
//5.用户列表
router.get('/list',function(req,res){
	var str=req.query;
	console.log(str);
	var pno=str.pno;
	var size=str.size;
	if(!pno)		pno=1;
	if(!size)     size=3;
	pno=parseInt(pno);
	size=parseInt(size);
	var start=(pno-1)*size;
	pool.query('select * from xz_user limit ?,?',[start,size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});

//完成用户模块下的删除路由 ，按照编号删除(get /delete)
router.get('/delete',function(req,res){
	//获取数据
	var str=req.query;
	console.log(str);
	//验证数据
	if(!str.uid){
		res.send({code:401,msg:'uid require'});
	}//DELETE FROM student WHERE sid='5';
	//执行SQL语句
	pool.query('delete from xz_user where uid=?',[str.uid],function(err,result){
		if(err) throw err;
		console.log(result);
		if(result.affectedRows>0){
			res.send('删除成功！');
		}else{
			res.send({code:301,msg:'删除失败!'});
		}
	});
});
//用户检索
router.get('/checkemail',function(req,res){
	var str=req.query;
	console.log(str);
	pool.query('select email from xz_user',function(err,result){
		if(err) throw err;
		console.log(result);
		for(var i=0; i<result.length;i++){
			if(result[i].email == str.email){
				res.send({code:200,msg:'success'});
			}else{
				res.send({code:301,msg:'email not extist'});
			}
		}
	});
});
//检测手机
router.get('/checkphone',function(req,res){
	var str=req.query;
	console.log(str);
	pool.query('select * from xz_user where phone=?',[str.phone],function(err,result){
		if(err) throw err;
		console.log(result);
		if(result.length>0){
			res.send({code:200,msg:'success'});
		}else{
			res.send({code:301,msg:'fail'});
		}
	});
});
//检测用户名
router.get('/checkuname',function(req,res){
	var str=req.query;
	console.log(str);
	pool.query('select * from xz_user where uname=?',[str.uname],function(err,result){
		if(err) throw err;
		console.log(result);
		if(result.length>0){
			res.send({code:200,msg:'success'});
		}else{
			res.send({code:301,msg:'fail'});
		}
	});
});

//导出路由器对象
module.exports=router;