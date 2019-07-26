const express=require('express');
const pool=require('../pool');
//创建路由器对象
var router=express.Router();

//分页查看路由
//完成商品模块路由器下的路由(列表) xz_laptop
router.get('/check',function(req,res){
	var str=req.query;
	console.log(str);
	var pno=str.pno;
	var size=str.size;
	if(!pno)  pno=1;
	if(!size)  size=9;
	pno=parseInt(pno);
	size=parseInt(size);
	var start=(pno-1)*size;
	console.log(start,size);
	pool.query('select * from xz_laptop limit ?,?',[start,size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//商品详情


//添加商品信息
router.post('/add',function(req,res){
	var str=req.body;
	console.log(str);
	var i=400;
	for(var key in str){
		i++;
		if(!str[key])
			res.send({code:i,msg:key+'   require'});
	}
	pool.query('insert into xz_laptop set ?',[str],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'添加成功'+result});
		}else{
			res.send('添加失败');
		}
	});
});
//删除商品
router.get('/delete',function(req,res){
	var str=req.query;
	console.log(str);
	if(!str.lid){
		res.send({code:401,msg:'lid require'});
	}
	pool.query('delete from xz_laptop where lid=?',[str.lid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'删除成功'});
		}else{
			res.send({code:201,msg:'删除失败'});
		}
	});
});

//修改商品
router.post('/update',function(req,res){
	var str=req.body;
	console.log(str);
	var i=400;
	for(var key in str){
		i++;
		if(!str[key])
			res.send({code:i,msg:key+'  require'});
	}
	pool.query('update xz_laptop set ? where lid=?',[str,str.lid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			pool.query('select * from xz_laptop where lid=?',[str.lid],function(err,result){
				if(err) throw err;
				res.send(result[0]);
			})
		}else{
			res.send({code:301,msg:'修改失败'});	
		}
	});
});

//导出商品路由
module.exports=router;