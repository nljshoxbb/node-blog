var mongoose = require('mongoose'),
	PaperSchema = require('../schemas/paper'),
	Paper = mongoose.model('Paper',PaperSchema);

module.exports = Paper;