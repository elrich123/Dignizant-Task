const Post = require("../models/PostsModel");
const httpStatus = require("http-status");
const sendMail = require("../mailgun");

// Create a new blog post
const createPost = async (req, res, next) => {

    try {

            const { title, content } = req.body;

            const newPost = new Post({
                title,
                content,
                author: req.userId,
            });

            const savedPost = await newPost.save();
            res.status(httpStatus.OK).json({
                message: "Post saved successfully!",
                data: {
                    postId: savedPost._id
                }
            });

            await sendMail("elrich1997@gmail.com", "New Post added", `Following posts was added - ${savedPost}` )

    } catch (error) {
        next(error);
    }
};

// Retrieve all blog posts
const getAllPosts = async (req, res, next) => {

    try {

        let { keyword, page, size } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(size);
        const limit = parseInt(size);

        let query = await Post.find();

        if (keyword) {
            query = Post.find({ title: { $regex: `^${keyword}`, $options: "i" } });
        }
        const posts = await query
            .sort("title")
            .skip(skip)
            .limit(limit);

        res.status(httpStatus.OK).json({
            message: "Successful data fetch",
            data: {
                posts: posts
            }
        })
    } catch (error) {
        next(error);
    }
}

// Update a blog post by ID
const getPostById = async (req, res, next) => {

    try {

        const { postId } = req.params;

        const post = await Post.findById(postId);

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

// Update a blog post by ID
const updatePost = async (req, res, next) => {

    try {

        const { postId } = req.params;
        const { title, content } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, UpdatedAt: Date.now() },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Post not found' });
        }

        res.status(httpStatus.OK).json({
            message: "Successful data fetch",
            data: {
                Updatedpost: updatedPost
            }
        })

    } catch (error) {
        next(error);
    }
}

// Delete a blog post by ID
const deletePost = async (req, res, next) => {

    try {

        const { postId } = req.params;

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(httpStatus.OK).json({
            message: "Post Deleted succesfully!"
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
}




