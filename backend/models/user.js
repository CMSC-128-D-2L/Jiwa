const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const utils = require('./utils')

const UserSchema = new mongoose.Schema(
	{
		password: {type: String, required: [true, "Enter a password."]},
		first_name: {type: String, required: [true, "No first name provided."]},
		middle_name: {type: String},
		last_name: {type: String, required: [true, "No last name provided."]},
		email: {type: String, required: [true, "No email provided"]},
    recoveryQA: {},
    isApproved: {type: Boolean, default: false},
    role: {type: String, enum: ['user', 'admin'], default: 'user', immutable: true}
	},
	{
		// toObject: {virtuals: true},
		// toJSON: {virtuals: true}
	}
)

UserSchema.pre("save", function(next) {
  const user = this;
  
  if (!user.isModified("password")) return next();
  
  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }
  
    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      user.password = hash;
      return next();
    });
  });
});

UserSchema.pre("save", function(next) {
  const user = this;
  
  user.first_name = utils.toTitleCase(user.first_name);
  user.middle_name = utils.toTitleCase(user.middle_name);
  user.last_name = utils.toTitleCase(user.last_name);

  return next();
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model("User", UserSchema);