var mongoose = require('mongoose'),
	NoticeSchema = new mongoose.Schema({
		// _id:{
		// 	type:String,
		// 	unique:true,
		// },
		title:String,
		content:String,
		name:String,
		time:String,
		meta: {
		    createAt: {type: Date,default: Date.now()},
		    updateAt: {type: Date,default: Date.now()}
		 }
	})
	NoticeSchema.pre('save', function(next) {
	  if (this.isNew) {
	    // console.log(this.isNew)
	    this.meta.createAt = this.meta.updateAt = Date.now();
	  } else {
	    this.meta.updateAt = Date.now();
	  }
	  next();
	});

NoticeSchema.statics = {
	fetch:function (cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	}
}

module.exports = NoticeSchema;
