const { Message } = require('../models/index').models;

// add request 
exports.create = (object, next) => {
	return new Promise((resolve, reject) => {
		const newMessage = new Message(object);

		newMessage.save((err, message) => {
			// failed: return error
			if(err) { reject(err) }
			// success: return new message
			else { resolve(message) }
		})
	})
}

// look for an existing message in the db
// This is used only for validation as of 03/06/22
exports.getOne = (query, next) => {
	return new Promise((resolve, reject) => {
		Message.findOne(query, (err, message) => {
			if (err) { reject(err); }
			resolve(message);
		});
	});
}

/*
GET
parameters:
	> req : request type (either create or edit)
		> { reqType: "" }
returns the request details, including User
*/
exports.getAllMessages = (req) => {
	return new Promise((resolve, reject) => {
		// find all messages whose request is kung ano pinass
		Message.find(req)
		// populate the data of userReq so that user details also appear
		.populate({
			path: 'userReq',
			// exclude pw and recoveryQA
			select: '-password -recoveryQA',
			options: {
				// sort by the last name of the requesting user (ascending)
				sort: { 'last_name': 1 }
			}
		})
		.exec((err, res) => {
			if(err){ reject(err); }
			else{ resolve(res); }
		})
	})
}

exports.editMessage = (object) => {
	console.log(object)
	console.log(object.show)
	return new Promise((resolve, reject) => {
		// findone then edit
		Message.findOne({ _id: object.id }, (err, message) => {
			if (err) { reject(err); }
			message.isResolved = object.isResolved;
			message.show = object.show;
			if(message.isResolved){
				message.password = object.password ; 
			}
			message.save((err, message) => {
				if(err) { reject(err); }
				resolve(message);
			});
		});
	});
}

exports.deleteOne = (query) => {
	return new Promise((resolve, reject) => {
		Message.deleteOne(query, (err, message) => {
			if(err) reject(err)
			else { resolve(message) }
		})
	})
}