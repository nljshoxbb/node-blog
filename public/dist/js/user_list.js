$.support.cors=!0,$(function(){$(".userDel").click(function(e){var s=$(e.target),i=s.data("id"),r=$(".users-id-"+i);$.ajax({type:"DELETE",url:"/admin/user/list?id="+i}).done(function(e){1===e.success&&r&&r.remove()})})});