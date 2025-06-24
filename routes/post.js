const express = require("express");
const postController = require("../controllers/post");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.get("/find/all", postController.getAllPosts);
router.get("/find/:postId", postController.getPostById);
router.post("/add", verify, postController.addPost);
router.patch("/edit/:postId", verify, postController.editPost);
router.delete("/delete/:postId", verify, postController.deletePost);

router.get("/comments/all", verify, verifyAdmin, postController.getAllComments);
router.get("/:postId/comments/find/all", postController.getPostComments);
router.post("/:postId/comments/add", verify, postController.addComment);
router.delete("/:postId/comments/delete/:commentId", verify, postController.deleteComment);

module.exports = router;