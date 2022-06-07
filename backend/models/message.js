const mongoose = require("mongoose")
//create - approval of user signup
//edit - arppoval to change password etc.
const messageSchema = new mongoose.Schema({
	userReq: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	isResolved: {
		type: Boolean,
		default:  false,
		required: true
	},
	reqType: {
		type: String, 
		enum:["create", "edit"],
		required: true
	},
	show: {
		type: Boolean, 
		default: true,
	},
	password: {
		type: String, 
		default: null,
	}
})

module.exports = mongoose.model("Message", messageSchema);