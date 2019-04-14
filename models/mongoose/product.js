const { Schema ,model} = require("mongoose");

const productSchema = new Schema({
	title: {
		type: String,
		required: true
  },
  price : {
    type: Number,
    required: true
  },
  imageUrl : {
    type: String,
    required : true
  },
  description : {
    type: String,
    required: true
  },
  userId : {
    type : Schema.Types.ObjectId,
    ref : "User"
  }
});

exports.ProductModel = model("Product" , productSchema);