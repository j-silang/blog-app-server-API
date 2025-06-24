const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: [true, "Post ID is required"]
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
		required: [true, "Comment Content is required"]
	},
	dateCommented: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model("Comment", commentSchema);