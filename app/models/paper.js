var mongoose = require('mongoose'),
	PaperSchema = require('../schemas/paper'),
	// 使用mongoose的模型方法编译生成模型
	Paper = mongoose.model('Paper',PaperSchema);
	
// 将模型构造函数导出
module.exports = Paper;