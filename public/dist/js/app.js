require.config({baseUrl:"/javascripts/lib",paths:{app:"../app",kindeditor:"../kindeditor",jquery:"//cdn.bootcss.com/jquery/1.12.4/jquery.min",bootstrap:"//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min",validate:"//cdn.bootcss.com/jquery-validate/1.14.0/jquery.validate.min"},shim:{bootstrap:{deps:["jquery"],exports:"bootstrap"},validate:{deps:["jquery"],exports:"validate"}}}),require(["jquery","bootstrap","validate","utils","kindeditor/kindeditor-all-min","app/comment","app/login","app/poper","app/confirm","app/slider"],function(e,t,o,i,d,n,r,l,a){if(window.KindEditor.create("textarea",{themeType:"simple",allowImageUpload:!1,resizeType:1,width:"100%",afterBlur:function(){this.sync()},items:["undo","redo","|","preview","code","cut","|","justifyleft","justifycenter","justifyright","justifyfull","insertorderedlist","insertunorderedlist","indent","outdent","|","fullscreen","/","formatblock","fontname","fontsize","|","forecolor","hilitecolor","bold","italic","underline","strikethrough","lineheight","removeformat","|","insertfile","table","hr","emoticons","baidumap"]}),document.getElementById("slide")){var s=document.getElementById("slide");Slider({dom:s,duration:5e3,speed:600,effect:"fade",isAutoPlay:!0,trigger:"click",pagination:!1,navigation:!1,pauseOnHover:!1})}if(document.getElementById("adSlide")){var c=document.getElementById("adSlide");console.log(c);Slider({dom:c,duration:5e3,speed:600,effect:"left",isAutoPlay:!0,trigger:"click",pagination:!1,navigation:!1,pauseOnHover:!1})}if(document.querySelector(".middle")){var p=document.querySelector(".middle");i.addEvent(p,"click",function(e){var e=window.event||e,t=e.target||e.srcElement;if(1===t.nodeType&&"panel-heading"===t.className)for(var o=t.childNodes,i=o.length,d=0;i>d;d++)1===o[d].nodeType&&o[d].click();else if("P"===t.tagName.toUpperCase()||"panel-body"===t.className){var n=t.parentNode.parentNode,r=n.firstChild.nextSibling;console.log(r);for(var d=0;d<r.childNodes.length;d++)1===r.childNodes[d].nodeType&&r.childNodes[d].click()}})}document.getElementById("postArticle")&&(window.onscroll=function(){var e=document.getElementById("postArticle"),t=document.documentElement.scrollTop||document.body.scrollTop,o=e.offsetTop,i=document.body.offsetHeight;t>o&&o+i>t?(e.style.position="fixed",e.style.top="0px"):e.style.position="relative"})});