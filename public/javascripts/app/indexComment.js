/**
 * 设置首页点击文章跳转到文章详细页面
 */


 define(['utils','app/poper','moment','kindeditor/kindeditor-all-min'],function (Utils,popuper,moment,kindeditor) {
 	function clickTopaper(dom) {
 		var middle = document.getElementById(dom);
 		Utils.addEvent(middle,'click',function (event) {
 			var event  = window.event || event;
 			var target = event.target || event.srcElement;
 			if ((target.nodeType === 1) && (target.className === 'panel-heading')) {
 				var panelNode = target.childNodes;
 				var len       = panelNode.length;
 				for(var i = 0;i < len;i++ ){
 					if (panelNode[i].nodeType === 1 ) {
 						panelNode[i].click();
 						
 					}
 				}
 			}else if (target.tagName.toUpperCase() === 'P'|| target.className === 'panel-body') {
 				var panel = target.parentNode.parentNode;
 				var pHeading = panel.firstChild.nextSibling;
 				for(var i = 0; i < pHeading.childNodes.length;i++){
 					if (pHeading.childNodes[i].nodeType === 1) {
 						pHeading.childNodes[i].click();
 					}
 				}
 				
 			}
 		})
 	}
 })

function clickInto(class) {
	var middle = document.querySelector(class);
	Utils.addEvent(middle,'click',function (event) {
		var event  = window.event || event;
		var target = event.target || event.srcElement;
		if ((target.nodeType === 1) && (target.className === 'panel-heading')) {
			var panelNode = target.childNodes;
			var len       = panelNode.length;
			for(var i = 0;i < len;i++ ){
				if (panelNode[i].nodeType === 1 ) {
					panelNode[i].click();
					
				}
			}
		}else if (target.tagName.toUpperCase() === 'P'|| target.className === 'panel-body') {
			var panel = target.parentNode.parentNode;
			var pHeading = panel.firstChild.nextSibling;
			for(var i = 0; i < pHeading.childNodes.length;i++){
				if (pHeading.childNodes[i].nodeType === 1) {
					pHeading.childNodes[i].click();
				}
			}
			
		}

	})
}
clickInto('.middle');