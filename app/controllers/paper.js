var mongoose = require('mongoose'),
	Paper 	 = mongoose.model('Paper'),
	Comment  = mongoose.model('Comment'),			
	_ 		 = require('underscore'),                //该模块用来对变化字段进行更新
	fs       = require('fs'),						 //读写文件模块
	path	 = require('path'),						 //路径模块
	moment    = require('moment');

/**
 * 获取发表页面控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.showPost=function(req,res){
	Paper.find({},function(err,paper){
		if (err) {
			console.log(err);
		}
		res.render('combine/post',{
	  	title:'发表页面',
  		user:req.session.user,
  		paper:{}
	 	})
	})

}

/**
 * 获取修改文章页面控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.edit=function(req,res){
	Paper.findOne({
		author:req.query.author,
		title:req.query.title
	},function(err,paper){
		if(err){
			paper=[];
			return;
		}
		res.render('combine/edit', { 
			title: '编辑页面',
			user:req.session.user,
			paper:paper,
		});
	});
}

/**
 * 修改文章控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.saveEdit=function(req,res){
	// console.log(req.body.title,req.session.user.name)
	Paper.findOneAndUpdate({
		title:req.body.title,
		author:req.session.user.name
	},{content:req.body.content},{new:true},function(err,paper){
		if(err){
			return;
		}
		if(paper){
			res.redirect('/index')
		}
	})
}

/**
 * 删除文章控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.delete=function(req,res){
	Paper.findOneAndRemove({
		title:req.query.title,
		author:req.query.author
	},function(err,paper){
		if(err){
			return;
		}

		if(paper){
			res.redirect('/user')
		}
	})
}

// exports.delete=function(req,res){
// 	var newPath = path.join(__dirname,'../../','/public/upload/');
// 	Paper.remove({title:req.query.title,author:req.query.author},function(err,paper){
// 		if(err){
// 			return console.log(err);
// 		}
// 		if(paper){
// 			fs.unlink(newPath,function (err) {
// 				if (err) {
// 					 console.log(err);
// 				}
// 				res.redirect('/user')
// 			})
			
// 		}
// 	})
// }


/**
 * 在用户文章列表中直接删除文章控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.userDelete = function (req,res) {
	// 获取ajax发送的请求id值
	var id = req.query.id;
	console.log(id);
	// 如果id值存在，服务器将该条数据删除并返回json格式的删除成功信息
	if (id) {
		Paper.remove({_id:id},function (err) {
			if (err) {
				console.log(err);
				return;
			}
			res.json({success:1});
		})
	}

}


/**
 * 获取用户详细文章控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getPaper = function (req,res) {
	var _id = req.params.id;
	var user = req.session.user;
	// 用户访问统计，每次访问文章详情页，pv增加1
	Paper.update({_id:_id},{$inc:{pv:1}},function (err) {
		if (err) {
			console.log(err);
		}
	});
	//Comment存储到数据库中的paper属性值与相应的paper _id值相同
	Paper.findById(_id,function (err,paper) {

		if (err) {
			console.log(err);
		}
		// 查找该_id值所对应的评论信息
		Comment.find({paper:_id})
			   .populate('from','name')
			   .populate('reply.from reply.to','name') //查找评论人和回复人的名字
			   .exec(function (err,comments) {
			   		// var time  = moment(comments.reply.meta.createAt).format('YYYY-MM-DD');
			   		if (err) {
			   			console.log(err);
			   			return;
			   		}
			   		res.render('combine/paper_detail',{
			   			title:'文章页面',
			   			paper:paper,
			   			user:user,
			   			comments:comments
			   			// time:meta.updateAt
			   		})
			   })
	})	
}



/**
 * 转载控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.reprint=function(req,res){
	var title=req.query.title,
	    author=req.query.author,
	    currentUser=req.session.user;
	var reprint_to={
		name:currentUser.name
	}
	Paper.findOne({
		title:title,
		author:author
	},function(err,paper){
		if(err){
			return;
		}
		paper.update({$push:{reprint_to:reprint_to}},function(err,paper){});
		var _paper={
			title:paper.title,
			type:'',
			content:paper.content,
			time:paper.time,
			type:false,
			author:currentUser.name,
			comments:[],
			pv:0,
			reprint_to:[],
			reprint_from:[{name:author}]
		};
		Paper.findOne({
			title:_paper.title,
			author:_paper.author
		},function(err,paper){
			if(err){
				console.log(err)
				return;
			}

			if(!paper){
				var re_paper = new Paper(_paper);
				re_paper.save(function(err){
					if (err) {
						console.log(err)
						return;
					}
					res.redirect('/index')
				})
			}
			else{
				res.redirect('back')
			}
		})
	})
}

/**
 * 搜索控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.search = function (req,res) {
	var date = new Date();
	var keyword = req.query.keyword;
	var pattern = new RegExp(keyword,'i');
	var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+ "-"+
             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	Paper.find({'title':pattern},{'name':1,'title':1,'time':1},function (err,paper) {
		if (err) {
			return;
		}
		res.render('./combine/search',{
			title:'搜索：'+ req.query.keyword,
			time:time,
			paper:paper,
			author:paper.author

		})
	})
}

/**
 * 图片上传控制器
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.saveImage = function(req, res, next) {
  // 如果有文件上传通过connect-multiparty中间件生成临时文件并通过req.files进行访问
  // 并且当提交表单中有文件上传请求时表单要使用enctype="multipart/form-data"编码格式
  var imageData        = req.files.uploadImage,                    // 上传文件
      filePath         = imageData.path,                             // 文件路径
      originalFilename = imageData.originalFilename;         // 原始名字
  // 如果有自定义上传图片，则存在文件名
  if(originalFilename) {
    fs.readFile(filePath, function(err,data) {
      if(err) {
        console.log(err);
        return;
      }
      var timestamp = Date.now(),                             // 获取时间
          type      = imageData.type.split('/')[1],               // 获取图片类型 如jpg png
          image     = timestamp + '.' + type,                    // 上传海报新名字
          // 将新创建的图片存储到/public/upload 文件夹下
          newPath = path.join(__dirname,'../../','/public/upload/' + image);
      // 写入文件
      fs.writeFile(newPath,data,function(err) {
        if(err) {
          console.log(err);
          return;
        }
        req.image = image;
        next();
      });
    });
  }else {
    // 没有自定义上传海报
    next();
  }
};

/**
 * 发送文章控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.post = function(req,res) {
  var paperObj 		  = req.body.paper,
  	  user     		  = req.session.user;

  paperObj.author  = user.name;
  // 如果有自定义上传海报  将paperObj中的海报地址改成自定义上传海报的地址
  if(req.image) {
    paperObj.image = req.image;
  }
  if(paperObj.title) {
    // 查找该文章名称是否已存在
    Paper.findOne({title:paperObj.title},function(err,_paper) {
      if (err) {
        console.log(err);
        return;
      }
      if (_paper) {
        console.log('文章标题已存在');
        res.json({success:1});
      }else {
        // 创建一个新文章数据
        var newPaper = new Paper(paperObj);
        newPaper.save(function(err,_newPaper) {
          if(err){
            console.log(err);
            return;
          }
            res.redirect('/index');
        });
      }
    });
  }else {
    res.redirect('/post');
  }
};
