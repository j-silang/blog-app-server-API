const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Username is required"]
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: [true, "Password is required"]
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model("User", userSchema);