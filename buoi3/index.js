import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(express.json());

const PORT = 3001;

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResponse = await axios.get(`http://localhost:5001/users`);
    const users = userResponse.data;
    const isUserExist = users.find((user) => user.email === email);
    if (isUserExist) {
      return res.json({
        message: "User already existed",
      });
    }
    const user = {
      id: uuidv4(),
      userName: `US${Math.random().toString(36).substring(2, 7)}`,
    };
    await axios.post(`http://localhost:5001/users`, {
      email,
      password,
      ...user,
    });
    return res.json({
      message: "Register successfully",
      result: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: "Error: " + error.message,
    });
  }
});

app.post("/post", async (req, res) => {
  try {
    const { authorId, content } = req.body;
    const newPost = {
      id: uuidv4(),
      content: content,
    };
    await axios.post(`http://localhost:5001/posts`, {
      authorId,
      ...newPost,
    });
    return res.json({
      message: "Post successfully",
      result: newPost,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: "Error: " + error.message,
    });
  }
});

// Edit post
app.put("/post", async (req, res) => {
  try {
    const { authorId, content, id } = req.body;
    const response = await axios.get(`http://localhost:5001/posts`);
    const posts = response.data;
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex == -1) {
      return res.status(404).json({ message: "The post does not exist" });
    }
    const post = posts[postIndex];
    if (post.authorId !== authorId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit" });
    }
    post.content = content;
    await axios.put(`http://localhost:5001/posts/${id}`, post);
    return res.json({
      message: "Edit successfully",
      result: post,
    });
  } catch (error) {
    return res
      .status(error.response.status || 500)
      .json({ message: "Error: " + error.message });
  }
});

// Post comment
app.post("/comment", async (req, res) => {
  // không được để là post nữa
  try {
    const { postId, content, authorId } = req.body;
    const response = await axios.get(`http://localhost:5001/posts/${postId}`);
    const post = response.data;

    if (!post) {
      return res.status(404).json({ message: "The post does not exist." });
    }

    const comment = {
      id: uuidv4(),
      postId,
      authorId,
      content,
    };
    await axios.post(`http://localhost:5001/comments`, comment);
    return res.json({ message: "Comment successfully", result: comment });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: "Error: " + error.message,
    });
  }
});

// Edit comment
app.put("/comment", async (req, res) => {
  try {
    const { id, content, authorId } = req.body;
    const response = await axios.get(`http://localhost:5001/comments`);
    const comments = response.data;
    const commentIndex = comments.findIndex((comment) => comment.id === id);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "The post does not exist" });
    }
    const comment = comments[commentIndex];
    if (comment.authorId !== authorId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit" });
    }
    comment.content = content;
    await axios.put(`http://localhost:5001/comments/${id}`, comment);
    return res.json({
      message: "Edit successfully",
      result: comment,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: "Error: " + error.message });
  }
});

// Get all comments of a post
app.get("/post/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const response = await axios.get(`http://localhost:5001/comments`);
    const comments = response.data.filter(
      (comment) => comment.postId === postId
    );
    if (comments.length === 0) {
      return res.status(404).json({ message: "There's no comment" });
    }
    return res.json({ message: "Get comments successfully", result: comments });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: "Error: " + error.message });
  }
});

// Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user .
app.get("/posts", async (req, res) => {
  try {
    const postResponse = await axios.get(`http://localhost:5001/posts`);
    const posts = postResponse.data;

    const commentResponse = await axios.get(`http://localhost:5001/comments`);
    const comments = commentResponse.data;

    const postsWithComments = posts.map((post) => {
      const postComments = comments.filter(
        (comment) => comment.postId === post.id
      );
      const firstThreeComments = postComments.slice(0, 3);
      return {
        post,
        comments: firstThreeComments,
      };
    });
    return res.json({
      message: "Get all posts with first 3 comments successfully",
      result: postsWithComments,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: "Error: " + error.message });
  }
})

// Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId
app.get("/post/:postId", async (req, res) => {
    try {
      const { postId } = req.params;
      const postResponse = await axios.get(`http://localhost:5001/posts/${postId}`);
      const post = postResponse.data;
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const commentResponse = await axios.get(`http://localhost:5001/comments`);
      const comments = commentResponse.data.filter(comment => comment.postId === postId);
  
      return res.json({ message: "Get post with comments successfully", post, comments });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: "Error: " + error.message });
    }
  });


app.get("/", (req, res) => {
  return res.json({});
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error ${err.message}`);
  } else {
    console.log(`Success at ${PORT}`);
  }
});
