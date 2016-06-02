/**
 * 评论模块
 * @param  {[type]} Utils   [description]
 * @param  {[type]}
 * @return {[type]}         [description]
 */


define(['utils', 'moment', 'app/poper', 'kindeditor/kindeditor-all-min'], function(Utils, moment, popuper, kindeditor) {

  if (document.getElementById('mediaList')) {
    var mediaList   = document.getElementById('mediaList');
    var comment     = document.getElementById('comments');
    var openComment = document.getElementById('openComment');
    var cover       = document.querySelector('.popuper');


    Utils.addEvent(mediaList, 'click', function(event) {
      event.preventDefault();
      var event   = window.event || event;
      var target  = event.target || event.srcElement;
      // 获取表单
      var commentForm = document.getElementById('commentForm');
      var paper       = comment.getElementsByTagName('input')[0]; //获取评论所在文章的_id
      var fro         = comment.getElementsByTagName('input')[1]; //获取评论人的_id

      // 评论回复
      if (target.className === 'comment') {
        // 给当前要叠楼回复的楼主添加id
        if (target.parentNode.getAttribute('class') === 'media-body') {
          target.parentNode.setAttribute('id', 'mediaBody');
        }

        // 创建两个隐藏input标签加入发送ajax表单中
        var toInput = document.createElement('INPUT');
        var tCinput = document.createElement('INPUT');
        // 记录评论的id
        toInput.setAttribute('type', 'hidden');
        toInput.setAttribute('id', 'toId');
        toInput.setAttribute('name', 'comment[tid]');
        toInput.setAttribute('value', target.dataset.tid);
        commentForm.appendChild(toInput);
        // 记录被回复评论的id
        tCinput.setAttribute('type', 'hidden');
        tCinput.setAttribute('id', 'commentId');
        tCinput.setAttribute('name', 'comment[cid]');
        tCinput.setAttribute('value', target.dataset.cid);
        commentForm.appendChild(tCinput);

        // 获取动态添加的input隐藏标签
        var commentTid = commentForm.getElementsByTagName('input')[2];
        var commentCid = commentForm.getElementsByTagName('input')[3];
        var mediaBody = document.getElementById('mediaBody');

        var pop = Popuper({
          wrap: cover,
          confirm: function() {
            if (document.getElementById('toId') && document.getElementById('commentId')) {
              var content = document.getElementById('commentContent'); //获取评论内容
              var tid     = document.getElementById('toId').value;
              var cid     = document.getElementById('commentId').value;
              var data    = {
                'comment[paper]': paper.value, //文章id
                'comment[from]': fro.value, //文章作者id
                'comment[content]': content.value, //文章内容
                // 如果点击回复按钮对评论进行回复，就会产生来个隐藏的表单
                // 分别有被回复人的Id和点击该条评论人的Id
                'comment[tid]': tid, //回复
                'comment[cid]': cid //
              }
            }
            Utils.ajax({
              url: '/comment',
              method: 'post',
              data: data,
              async: true,
              success: function(results) {
                var data        = JSON.parse(results).data || {},
                    commentForm = document.getElementById('commentForm'),
                    commentTid  = commentForm.getElementsByTagName('input')[2],
                    commentCid  = commentForm.getElementsByTagName('input')[3],
                    mediaBody   = document.getElementById('mediaBody');

                if (data.reply.length) {
                  var len   = data.reply.length;
                  var media = document.createElement('DIV');
                  media.setAttribute('class', 'media');
                  media.innerHTML = '<div class="media-left"><img src="/images/headImg.png" style="width:30px;height:30px"/></div><div class="media-body"><h4 class="media-heading">' + data.reply[len - 1].from.name + '<span>&nbsp;@&nbsp;</span>' + data.reply[len - 1].to.name + '</h4><p>' + data.reply[len - 1].content + '</p><span class="createAt">' + moment(new Date()).format('MM-DD HH:mm') + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid=' + data._id + ' data-tid=' + data.reply[len - 1].to._id + '>回复</a>&nbsp;|&nbsp;<a class="comment-del" href="javascript:;" data-cid=' + data._id + ' data-did=' + data.reply[len - 1]._id + '><i class="fa fa-trash"></i>&nbsp删除</a></div>';

                  if (mediaBody.parentNode.tagName === 'LI') {
                    mediaBody.appendChild(media);
                  } else if (mediaBody.parentNode.tagName === 'DIV') {
                    mediaBody.parentNode.parentNode.appendChild(media);
                  }
                }
                if (mediaBody) {
                  mediaBody.setAttribute('id', '');
                }
                //将叠楼评论中新建的两个隐藏表单清空，方便下次回复新内容时不会堆叠到此楼
                if (commentTid || commentCid) {
                  commentForm.removeChild(commentTid);
                  commentForm.removeChild(commentCid);
                  KindEditor.instances[0].html("")
                }
              }
            })
          },
          cancel: function() {
            if (mediaBody) {
              mediaBody.setAttribute('id', '');
            }
            //将叠楼评论中新建的两个隐藏表单清空，方便下次回复新内容时不会堆叠到此楼
            if (commentTid || commentCid) {
              commentForm.removeChild(commentTid);
              commentForm.removeChild(commentCid);
            }
          }
        })
      }

      // 删除评论
      var commentDel = document.querySelector('.comment-del');
      if (commentDel) {
        var cid = target.dataset.cid;
        var did = target.dataset.did;
        if (target.className === 'comment-del') {
          var deleteCover = document.getElementById('deletePopuper');
          var popDelete   = Popuper({
            wrap: deleteCover,
            effect:'bottom',
            confirm: function() {
              Utils.ajax({
                url: '/comment/:id?cid=' + cid + '&did=' + did,
                method: 'delete',
                async: true,
                success: function(results) {
                  var data = JSON.parse(results) || {};
                  if (data.success === 1) {
                    if (target.parentNode.parentNode.className === 'media') {
                      target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode)
                    }
                  }
                }
              })
            },
            cancel: function() {
            }
          })
        }
      }

    })

    // 文章评论
    Utils.addEvent(openComment, 'click', function(event) {
      event.preventDefault();
      var event   = window.event || event;
      var target  = event.target || event.srcElement;

      var pop = Popuper({
        wrap: cover,
        effect:'right',
        confirm: function() {
          var content = document.getElementById('commentContent');
          var paper   = comment.getElementsByTagName('input')[0];
          var fro     = comment.getElementsByTagName('input')[1];
          var data    = {
            'comment[paper]': paper.value,
            'comment[from]': fro.value,
            'comment[content]': content.value
          }

          Utils.ajax({
            url: '/comment',
            method: 'post',
            data: data,
            async: true,
            success: function(results) {
              var commentForm = document.getElementById('commentForm');
              var data = JSON.parse(results).data || {},
                mediaBody = document.getElementById('mediaBody');
              // 如果是对评论进行回复
              var media = document.createElement('LI');
              var m     = media.nextSbiling;
              media.setAttribute('class', 'media');
              media.innerHTML = '<div class="media-left"><img src="/images/headImg.png" style="width:40px;height:40px;"/></div><div class="media-body"><h4 class="media-heading">' + data.from.name + '</h4><p>' + data.content + '</p><span class="createAt">' + moment(new Date()).format('MM-DD HH:mm') + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="comment" href="#comments" data-cid=' + data._id + ' data-tid=' + data.from._id + '>回复</a>&nbsp;|&nbsp;<a class="comment-del" href="javascript:;" data-cid=' + data._id + '><i class="fa fa-trash"></i>&nbsp;删除</a></div><hr>'
              mediaList.appendChild(media);
              content.value = '';
              KindEditor.instances[0].html("")
            }
          })
        },
        cancel: function() {

        }

      })

    })
  }

})