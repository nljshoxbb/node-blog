define(['utils','moment'],function (Utils,moment) {
        getComment = (function (obj) {
          var mediaList    = document.getElementById('mediaList');
          var comment      = document.getElementById('comments');
          var button       = comment.getElementsByTagName('button')[0];


          Utils.addEvent(mediaList,'click',function (event) {
            var event       = window.event || event,
              target      = event.target || event.srcElement,
              toId      = document.getElementById('toId'),
              commentId     = document.getElementById('commentId'),
              commentForm   = document.getElementById('commentForm');
            // 给当前要叠楼回复的楼主添加id值
            if (target.parentNode.getAttribute('class') === 'media-body' ) {
              target.parentNode.setAttribute('id','mediaBody');
            }

            if (target.className === 'comment') {
              if (toId && commentId) {
                toId.value = target.dataset.tid;
                commentId.value = target.dataset.cid;
              }else{
                // 创建两个隐藏input标签加入表单中
                var toInput = document.createElement('INPUT');
                var tCinput = document.createElement('INPUT');
                // 设置属性
                toInput.setAttribute('type','hidden');
                toInput.setAttribute('id','toId');
                toInput.setAttribute('name','comment[tid]');
                toInput.setAttribute('value',target.dataset.tid);
                commentForm.appendChild(toInput);

                tCinput.setAttribute('type','hidden');
                tCinput.setAttribute('id','commentId');
                tCinput.setAttribute('name','comment[cid]');
                tCinput.setAttribute('value',target.dataset.cid);
                commentForm.appendChild(tCinput);
              }
            }

            // 删除评论
            var commentDel = document.querySelector('.comment-del');
            if (commentDel) {
              var cid = target.dataset.cid;
              var did = target.dataset.did;
              if (target.className === 'comment-del') {
                Utils.ajax({
                  url:'/comment/:id?cid='+ cid + '&did=' + did,
                  method:'delete',
                  async:true,
                  success:function (results) {
                    var data  = JSON.parse(results) || {};
                    if (data.success === 1) {
                      if (target.parentNode.parentNode.className === 'media') {
                        target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode)
                      }
                    }
                  }
                })
              }       
            }   

          })

          Utils.addEvent(button,'click',function (event) {
            event.preventDefault();
            var event      = window.event || event;
            var target     = event.target || event.srcElement;
            var commentForm  = document.getElementById('commentForm');
            var content    = document.getElementById('commentContent');
            var paper        = comment.getElementsByTagName('input')[0];
            var fro          = comment.getElementsByTagName('input')[1];  

            if (target.parentNode.getAttribute('class') === 'media-body' ) {
              target.parentNode.setAttribute('id','mediaBody');
            }

            if (document.getElementById('toId') && document.getElementById('commentId')) {
              var tid = document.getElementById('toId').value;
              var cid = document.getElementById('commentId').value;

              var data = {
                'comment[paper]':paper.value,
                'comment[from]':fro.value,
                'comment[content]':content.value,
                // 如果点击回复按钮对评论进行回复，就会产生来个隐藏的表单
                // 分别有被回复人的Id和点击该条评论人的Id
                'comment[tid]':tid,
                'comment[cid]':cid
              }
            }else{
              var data = {
                'comment[paper]':paper.value,
                'comment[from]':fro.value,
                'comment[content]':content.value,
              }
            }

            Utils.ajax({
              url:'/comment',
              method:'post',
              data:data,
              async:true,
              success:function (results) {
                var data       = JSON.parse(results).data || {},      
                  commentForm  = document.getElementById('commentForm'),
                  commentTid = commentForm.getElementsByTagName('input')[2],
                  commentCid = commentForm.getElementsByTagName('input')[3],
                  mediaBody    = document.getElementById('mediaBody');

                // 如果是对评论进行回复
            
                if (data.reply.length) {
                  var len = data.reply.length;
                  var media = document.createElement('DIV');
                  media.setAttribute('class','media');
                  media.innerHTML = '<div class="media-left"><img src="/images/headImg.png" style="width:30px;height:30px"/></div><div class="media-body"><h4 class="media-heading">'
                  + data.reply[len-1].from.name + '<span>&nbsp;@&nbsp;</span>' + data.reply[len-1].to.name + '</h4><p>' + data.reply[len-1].content + '</p><span class="createAt">'
                  + moment(new Date()).format('MM-DD HH:mm') + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid=' + data._id + ' data-tid=' + data.reply[len-1].to._id
                  +'>回复</a>&nbsp;|&nbsp;<a class="comment-del" href="javascript:;" data-cid=' + data._id + ' data-did=' + data.reply[len-1]._id + '><i class="fa fa-trash"></i>&nbsp删除</a></div>';

                  if (mediaBody.parentNode.tagName === 'LI') {
                    mediaBody.appendChild(media);
                  }else if (mediaBody.parentNode.tagName === 'DIV') {
                    mediaBody.parentNode.parentNode.appendChild(media);
                  } 
                }else{
                  var media = document.createElement('LI');
                  var m = media.nextSbiling
                  media.setAttribute('class','media');

                  media.innerHTML = '<div class="media-left"><img src="/images/headImg.png" style="width:40px;height:40px;"/></div><div class="media-body"><h4 class="media-heading">'
                  + data.from.name + '</h4><p>' + data.content + '</p><span class="createAt">' + moment(new Date()).format('MM-DD HH:mm') + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid='
                  + data._id + ' data-tid=' + data.from._id + '>回复</a>&nbsp;|&nbsp;<a class="comment-del" href="javascript:;" data-cid='
                  + data._id +'><i class="fa fa-trash"></i>&nbsp;删除</a></div><hr>'

                  mediaList.appendChild(media);
                }
                // 给叠楼回复内容完后要删除给叠楼楼主添加的id值，方便下次点击其他叠楼楼主继续添加该id
                if (mediaBody) {
                  mediaBody.setAttribute('id','');
                }
                
                //将叠楼评论中新建的两个隐藏表单清空，方便下次回复新内容时不会堆叠到此楼
                if (commentTid || commentCid) {
                  commentForm.removeChild(commentTid);
                  commentForm.removeChild(commentCid);
                  content.value = '';
                }
              }
            })
          })
        })();
})


      
      
    