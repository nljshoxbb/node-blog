define(["utils","moment","app/poper","kindeditor/kindeditor-all-min"],function(e,t,n,a){if(document.getElementById("mediaList")){var m=document.getElementById("mediaList"),d=document.getElementById("comments"),i=document.getElementById("openComment"),c=document.querySelector(".popuper");e.addEvent(m,"click",function(n){n.preventDefault();var n=window.event||n,a=n.target||n.srcElement,m=document.getElementById("commentForm"),i=d.getElementsByTagName("input")[0],o=d.getElementsByTagName("input")[1];if("comment"===a.className){"media-body"===a.parentNode.getAttribute("class")&&a.parentNode.setAttribute("id","mediaBody");var s=document.createElement("INPUT"),r=document.createElement("INPUT");s.setAttribute("type","hidden"),s.setAttribute("id","toId"),s.setAttribute("name","comment[tid]"),s.setAttribute("value",a.dataset.tid),m.appendChild(s),r.setAttribute("type","hidden"),r.setAttribute("id","commentId"),r.setAttribute("name","comment[cid]"),r.setAttribute("value",a.dataset.cid),m.appendChild(r);var l=m.getElementsByTagName("input")[2],p=m.getElementsByTagName("input")[3],u=document.getElementById("mediaBody");Popuper({wrap:c,confirm:function(){if(document.getElementById("toId")&&document.getElementById("commentId"))var n=document.getElementById("commentContent"),a=document.getElementById("toId").value,m=document.getElementById("commentId").value,d={"comment[paper]":i.value,"comment[from]":o.value,"comment[content]":n.value,"comment[tid]":a,"comment[cid]":m};e.ajax({url:"/comment",method:"post",data:d,async:!0,success:function(e){var n=JSON.parse(e).data||{},a=document.getElementById("commentForm"),m=a.getElementsByTagName("input")[2],d=a.getElementsByTagName("input")[3],i=document.getElementById("mediaBody");if(n.reply.length){var c=n.reply.length,o=document.createElement("DIV");o.setAttribute("class","media"),o.innerHTML='<div class="media-left"><img src="/images/headImg.png" style="width:30px;height:30px"/></div><div class="media-body"><h4 class="media-heading">'+n.reply[c-1].from.name+"<span>&nbsp;@&nbsp;</span>"+n.reply[c-1].to.name+"</h4><p>"+n.reply[c-1].content+'</p><span class="createAt">'+t(new Date).format("MM-DD HH:mm")+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid='+n._id+" data-tid="+n.reply[c-1].to._id+'>回复</a>&nbsp;|&nbsp;<a class="comment-del" href="javascript:;" data-cid='+n._id+" data-did="+n.reply[c-1]._id+'><i class="fa fa-trash"></i>&nbsp删除</a></div>',"LI"===i.parentNode.tagName?i.appendChild(o):"DIV"===i.parentNode.tagName&&i.parentNode.parentNode.appendChild(o)}i&&i.setAttribute("id",""),(m||d)&&(a.removeChild(m),a.removeChild(d),KindEditor.instances[0].html(""))}})},cancel:function(){u&&u.setAttribute("id",""),(l||p)&&(m.removeChild(l),m.removeChild(p))}})}var g=document.querySelector(".comment-del");if(g){var y=a.dataset.cid,v=a.dataset.did;if("comment-del"===a.className){var f=document.getElementById("deletePopuper");Popuper({wrap:f,effect:"bottom",confirm:function(){e.ajax({url:"/comment/:id?cid="+y+"&did="+v,method:"delete",async:!0,success:function(e){var t=JSON.parse(e)||{};1===t.success&&"media"===a.parentNode.parentNode.className&&a.parentNode.parentNode.parentNode.removeChild(a.parentNode.parentNode)}})},cancel:function(){}})}}}),e.addEvent(i,"click",function(n){n.preventDefault();var n=window.event||n;n.target||n.srcElement,Popuper({wrap:c,effect:"right",confirm:function(){var n=document.getElementById("commentContent"),a=d.getElementsByTagName("input")[0],i=d.getElementsByTagName("input")[1],c={"comment[paper]":a.value,"comment[from]":i.value,"comment[content]":n.value};e.ajax({url:"/comment",method:"post",data:c,async:!0,success:function(e){var a=(document.getElementById("commentForm"),JSON.parse(e).data||{}),d=(document.getElementById("mediaBody"),document.createElement("LI"));d.nextSbiling;d.setAttribute("class","media"),d.innerHTML='<div class="media-left"><img src="/images/headImg.png" style="width:40px;height:40px;"/></div><div class="media-body"><h4 class="media-heading">'+a.from.name+"</h4><p>"+a.content+'</p><span class="createAt">'+t(new Date).format("MM-DD HH:mm")+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid='+a._id+" data-tid="+a.from._id+'>回复</a>&nbsp;|&nbsp;<a class="comment-del" href="javascript:;" data-cid='+a._id+'><i class="fa fa-trash"></i>&nbsp;删除</a></div><hr>',m.appendChild(d),n.value="",KindEditor.instances[0].html("")}})},cancel:function(){}})})}});