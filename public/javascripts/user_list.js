$.support.cors = true;
$(function () {
	// 获取用户列表删除按钮类名，当点击删除按钮触发删除事件
	$('.userDel').click(function (e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.users-id-' +id);
		$.ajax({
			type:'DELETE',
			url:'/admin/user/list?id='+ id
		})
		.done(function (result) {
			// 如果服务器返回json数据中success = 1，并且删除行存在，则将该行数据删除
			if (result.success === 1 && tr) {
				tr.remove();
			}
		})
	})
})