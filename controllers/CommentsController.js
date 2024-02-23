const sendMail = require("../mailgun");
const Comment = require("../models/CommentsModel");
const Post = require("../models/PostsModel");
const httpStatus = require("http-status");
const User = require("../models/UserModel");

const createComment = async (req, res, next) => {

    try {

        const { text, postId } = req.body;

        const user = User.findById(req.userId);

        console.log(user._id, user.email);

        const post = Post.findById(postId);

        if (!post) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Post not found' });
        }

        const newComment = new Comment({
            text,
            author: req.userId,
            post: postId
        });

        const savedComment = await newComment.save();

        saveCommentToPost = await Post.findOneAndUpdate({ _id: postId  },
            { $push: { comments: savedComment._id } },
            { new: true, runValidators: true });

        res.status(httpStatus.OK).json({
            message: "Comment added successfully",
            data: {
                commentId: savedComment._id
            }
        })

        await sendMail("elrich1997@gmail.com", "New Comment added", `Following comment were added to post Id-  ${post._id} Comments - ${savedComment}` )
    } catch (error) {
        next(error);
    }
};

const getCommentsForPost = async (req, res, next) => {

    try {

        const { postId } = req.params;

        const post = await Post.findById(postId).populate('comments');

        if (!post) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Post not found' });
        }

        res.status(httpStatus.OK).json({
            message: "Successful data fetch",
            data: {
                post: post
            }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createComment,
    getCommentsForPost
}