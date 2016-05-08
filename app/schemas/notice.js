var mongoose = require('mongoose'),
	NoticeSchema = new mongoose.Schema({
		_id:{
			type:String,
			unique:true,
		},
		name:String,
		state:{
			type:String,
			default:'1'
		},
		meta: {
		    createAt: {
		      type: Date,
		      default: Date.now()
		    },
		    updateAt: {
		      type: Date,
		      default: Date.now()
		    }
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

	// AdSchema.static = {
	// 	getOneAd:function (res,) {
	// 		// body...
	// 	}
	// }