
/**
 * 弹窗模块
 * @param  {[type]} Utils    [description]
 * @param  {[type]} 
 * @return {[type]}          [description]
 */

define(['utils','app/poper','moment'],function (Utils,popuper,moment) {
	
	// 删除文章弹窗
	if (document.querySelector('.user-paper-list')) {
		var cover = document.querySelector('.popuper');
		var paperList = document.querySelector('.user-paper-list');
		// 事件委托
		Utils.addEvent(paperList,'click',function (event) {
			var event  = window.event || event,
				target = event.target || event.srcElement,
				id     = target.getAttribute('data-id');
			
			if (target.className === 'uPdelete') {
				var	pop = Popuper({
							wrap:cover,
							confirm:function () {
								Utils.ajax({
									url:'/user/paper/list?id='+ id,
									method:'delete',
									async:true,
									success:function (results) {
										var data = JSON.parse(results);
										if (data.success === 1) {
											paperList.removeChild(target.parentNode.parentNode.parentNode);
										}
									}
								})
							},
							cancel:function () {
							}
						});
			}
		})
	}

	// 标题重复弹窗
	if (document.getElementById('inputTitle')) {
		var inputTitle = document.getElementById('inputTitle');

		Utils.addEvent(inputTitle,'onkeyup',function (event) {
			var data = {title:inputTitle.value}
			Utils.ajax({
				url:'/searchTitle',
				method:'post',
				data:data,
				async:true,
				success:function (results) {
					var data = JSON.parse(results);
					if (data.success === 1) {
						var pop = Popuper({
							wrap:cover,
							confirm:function () {
							},
							cancel:function () {
								
							}
						})
					}
				}
			})
		})
	}

	// 写文章弹窗
	if (document.getElementById('postArticle')) {
		var postArticle = document.getElementById('postArticle');
		var cover = document.querySelector('.popuper');
		Utils.addEvent(postArticle,'click',function (event) {
			event.preventDefault();
			var event  = window.event || event,
				target = event.target || event.srcElement; 
			var pop = Popuper({
				wrap:cover,
				effect:'top',
				confirm:function () {
					var title  = document.getElementById('inputTitle').value;
					var content= document.getElementById('inputContent').value;
					var data ={
						'paper[title]':title,
						'paper[content]':content
					}
					
					Utils.ajax({
						url:'/indexPost',
						method:'post',
						data:data,
						async:true,
						success:function (results) {
							var data = JSON.parse(results).data || {};
							console.log(data);
							if (data._id) {
								var middle = document.querySelector('.middle');
								var middleNodes = middle.childNodes;
								var panels = [];
								for(var i = 0;i < middleNodes.length; i++){										
									if (middleNodes[i].className === 'panel' && middleNodes[i].nodeType === 1) {
										panels.push(middleNodes[i]);
									}
								}
								var panel = document.createElement('DIV');
								panel.className = 'panel'
								panel.innerHTML = '<div class="panel-heading"><a href="/user?name=' + data.author +'"><img src="/images/headImg.png" alt="" style="width: 40px;height: 40px;">@'+ data.author +'&nbsp;&nbsp;</a><a href="/paper/'+ data._id +'" class="title middle-title shake shake-rotate">'+ data.title +'&nbsp;&nbsp;</a><span class="middle-title">'+ moment(new Date()).format('YYYY-MM-DD HH:mm')+'</span></div><div class="panel-body"><p>'+ data.content +'</p><p>&nbsp;&nbsp; <i class="fa fa-eye"></i>&nbsp;&nbsp;&nbsp;<a href="/paper/'+ data._id +'/#comments"><i class="fa fa-comments"></i></a></p></div>'
								// 转换类数组对象为数组
								var panelsArray = Array.prototype.slice.call(panels);
								middle.insertBefore(panel,panelsArray[0])
									// console.log(panelsArray[0])
							}else if (data === 1) {
								var titleError = document.getElementById('titleError');
								// 标题重复弹窗
								var popFail = Popuper({
									wrap:titleError,
									effect:'bottom',
									confirm:function () {
										
									},
									cancel:function () {
										
									}
								})
							}
							
						}
					})
				},
				cancel:function () {
				}
			})
		})
	}
})