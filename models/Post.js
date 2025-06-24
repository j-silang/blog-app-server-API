const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Post Title is required"],
	},
	author: {
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Author ID is required"]
		},
		authorName: {
			type: String,
			required: [true, "Author Name is required"]
		}
	},
	content: {
		type: String,
		required: [true, "Post Content is required"],
	},
	comments: [
	  {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: "Comment"
	  }
	],
	dateCreated: {
		type: Date,
		default: Date.now
	},
	lastUpdated: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model("Post", postSchema);