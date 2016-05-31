
/**
 * 弹窗模块
 * @param  {[type]} Utils    [description]
 * @param  {[type]} 
 * @return {[type]}          [description]
 */

define(['Utils','app/poper'],function (Utils,popuper) {
	
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
								pop.toggle();
							}
						});
				pop.toggle()
			}
		})
	}

	// 标题重复弹窗
	if (document.getElementById('savePaper')) {
		var btn = document.getElementById('savePaper');

		Utils.addEvent(btn,'click',function (event) {
			
			var event = window.event || event.srcElement;
			Utils.ajax({
				url:'/post',
				method:'get',
				async:true,
				success:function (results) {
					var data = JSON.parse(results);
					if (data.success === 1) {
						var pop = Popuper({
							wrap:cover,
							confirm:function () {
								pop.toggle();
							}
						})
					}
					pop.toggle;
				}
			})
		})
	}


	// 写文章弹窗
})