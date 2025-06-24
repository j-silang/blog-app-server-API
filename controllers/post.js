const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { errorHandler } = require("../auth");

module.exports.getAllPosts = async(req, res) => {
	try{
		const foundPosts = await Post.find({})
		res.status(200).json({
			success: true,
			posts: foundPosts
		})
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.getPostById = async(req, res) => {
	try{
		const foundPost = await Post.findById(req.params.postId);
		if(!foundPost){
			return res.status(404).json({ message: "Post not found "});
		}
		return res.status(200).json({
			success: true,
			foundPost: foundPost
		});
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.addPost = async(req, res) => {
	try{
		let newPost = new Post ({
			title: req.body.title,
			author: {
				authorId: req.user.id,
				authorName: req.user.username
			},
			content: req.body.content
		})
		const savedPost =  await newPost.save();
		return res.status(201).json({
			success: true,
			message: "Post created successfully",
			savedPost: savedPost
		});
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.editPost = async(req, res) => {
	try{
		const foundPost = await Post.findById(req.params.postId);
		if(!foundPost){
			return res.status(404).json({
				error: "Post not found",
				message: "This post is unavailable"
			});
		}
		if(foundPost.author.authorId.toString() !== req.user.id){
			return res.status(403).json({
				error: "Forbidden",
				message: "You do not have permission to perform this action."
			});
		}
		let postUpdate = {
			title: req.body.title,
			content: req.body.content,
			lastUpdated: Date.now()
		}
		const updatedPost = await Post.findByIdAndUpdate(req.params.postId, postUpdate, { new: true });
		return res.status(200).json({
			success: true,
			message: "Post updated successfully",
			post: updatedPost
		})
	}catch(error){
		return errorHandler(error, req, res)
	}
}

module.exports.deletePost = async(req, res) => {
	try{
		const foundPost = await Post.findById(req.params.postId);
		if(!foundPost){
			return res.status(404).json({
				error: "Post not found",
				message: "This post is unavailable"
			});
		}
		if(foundPost.author.authorId.toString() !== req.user.id && req.user.isAdmin === false ){
			return res.status(403).json({
				error: "Forbidden",
				message: "You do not have permission to perform this action."
			});
		}
		await Post.deleteOne({ _id: req.params.postId });
		return res.status(200).json({
			success: true,
			message: "Post deleted successfully"
		});
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.addComment = async(req, res) => {
	try{
		console.log("req.user:", req.user);
		console.log("req.params.postId:", req.params.postId);
		console.log("req.body.content:", req.body.content);
		const foundPost = await Post.findById(req.params.postId);
		if(!foundPost){
			return res.status(404).json({
				error: "Post not found",
				message: "This post is unavailable"
			});
		}
		let newComment = new Comment ({
			postId: foundPost._id,
			author: {
				authorId: req.user.id,
				authorName: req.user.username
			},
			content: req.body.content
		})
		const savedComment = await newComment.save();
		foundPost.comments.push(savedComment._id);
		await foundPost.save();
		return res.status(201).json({
			success: true,
			message: "Comment added successfully"
		})
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.getPostComments = async(req, res) => {
	try{
		const foundComments = await Comment.find({ postId: req.params.postId });
		res.status(200).json({
			success: true,
			comments: foundComments
		})
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.deleteComment = async(req, res) => {
	try{
		const foundPost = await Post.findById(req.params.postId);
		if(!foundPost){
			return res.status(404).json({
				error: "Post not found",
				message: "This post is unavailable"
			});
		}
		if(foundPost.author.authorId.toString() !== req.user.id && req.user.isAdmin === false ){
			return res.status(403).json({
				error: "Forbidden",
				message: "You do not have permission to perform this action."
			});
		}
		await Comment.deleteOne({ _id: req.params.commentId });
		foundPost.comments.pull(req.params.commentId);
		await foundPost.save();
		return res.status(200).json({
			success: true,
			message: "Comment deleted successfully"
		});
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.getAllComments = async(req, res) => {
	try{
		const comments = await Comment.find({});
		return res.status(200).json({
			success: true,
			comments: comments
		});
	}catch(error){
		return errorHandler(error, req, res);
	}
}