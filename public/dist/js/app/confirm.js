define(["utils","app/poper","moment"],function(e,t,n){if(document.querySelector(".user-paper-list")){var a=document.querySelector(".popuper"),c=document.querySelector(".user-paper-list");e.addEvent(c,"click",function(t){var t=window.event||t,n=t.target||t.srcElement,r=n.getAttribute("data-id");if("uPdelete"===n.className){Popuper({wrap:a,confirm:function(){e.ajax({url:"/user/paper/list?id="+r,method:"delete",async:!0,success:function(e){var t=JSON.parse(e);1===t.success&&c.removeChild(n.parentNode.parentNode.parentNode)}})},cancel:function(){}})}})}if(document.getElementById("inputTitle")){var r=document.getElementById("inputTitle");e.addEvent(r,"onkeyup",function(t){var n={title:r.value};e.ajax({url:"/searchTitle",method:"post",data:n,async:!0,success:function(e){var t=JSON.parse(e);if(1===t.success){Popuper({wrap:a,confirm:function(){},cancel:function(){}})}}})})}if(document.getElementById("postArticle")){var o=document.getElementById("postArticle"),a=document.querySelector(".popuper");e.addEvent(o,"click",function(t){t.preventDefault();var t=window.event||t;t.target||t.srcElement,Popuper({wrap:a,effect:"top",confirm:function(){var t=document.getElementById("inputTitle").value,a=document.getElementById("inputContent").value,c={"paper[title]":t,"paper[content]":a};e.ajax({url:"/indexPost",method:"post",data:c,async:!0,success:function(e){var t=JSON.parse(e).data||{};if(console.log(t),t._id){for(var a=document.querySelector(".middle"),c=a.childNodes,r=[],o=0;o<c.length;o++)"panel"===c[o].className&&1===c[o].nodeType&&r.push(c[o]);var i=document.createElement("DIV");i.className="panel",i.innerHTML='<div class="panel-heading"><a href="/user?name='+t.author+'"><img src="/images/headImg.png" alt="" style="width: 40px;height: 40px;">@'+t.author+'&nbsp;&nbsp;</a><a href="/paper/'+t._id+'" class="title middle-title shake shake-rotate">'+t.title+'&nbsp;&nbsp;</a><span class="middle-title">'+n(new Date).format("YYYY-MM-DD HH:mm")+'</span></div><div class="panel-body"><p>'+t.content+'</p><p>&nbsp;&nbsp; <i class="fa fa-eye"></i>&nbsp;&nbsp;&nbsp;<a href="/paper/'+t._id+'/#comments"><i class="fa fa-comments"></i></a></p></div>';var p=Array.prototype.slice.call(r);a.insertBefore(i,p[0])}else if(1===t){var s=document.getElementById("titleError");Popuper({wrap:s,effect:"bottom",confirm:function(){},cancel:function(){}})}}})},cancel:function(){}})})}});