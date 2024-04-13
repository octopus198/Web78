import express from 'express';
import { users, posts } from './data.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Viết API lấy thông tin của user với id được truyền trên params.
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id === id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({
            message: 'Không tìm thấy user',
            success: false,
            data: null
        });
    }
})

// need to check
// Viết API tạo user với các thông tin như trên users, với id là random (uuid), email là duy nhất, phải kiểm tra được trùng email khi tạo user.
app.use(express.json());

app.post('/users', (req, res) => {
    const {userName, email, age, avatar} = req.body;
    const checkEmailUnique = users.some(user => user.email === email)
    if (checkEmailUnique) {
        return res.status(400).json({ error: 'Email already exists' })
    }
    const user = {
        id: uuidv4(),
        userName: userName,
        email: email,
        age: age,
        avatar: avatar
    }
    users.push(user)
    res.status(201).json(newUser)
})

// Viết API lấy ra các bài post của user được truyền userId trên params.
app.get('/users/:userId/posts', (req, res) => {
    const id = req.params.id;
    const post = posts.filter(post => post.userId === id)
    if (post.length > 0) {
        res.send(post)
    } else {
        res.status(404).json({ message: 'User posts not found' });
    }
})

// Viết API thực hiện tạo bài post với id của user được truyền trên params.
app.post('/users/:userId/posts', (req, res) => {
    const userId = req.params.userId
    const { content, isPublic } = req.body
    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const newPost = {
        userId: userId,
        postId: uuidv4(), 
        content: content,
        createdAt: new Date().toISOString(), 
        isPublic: isPublic || false 
    }
    posts.push(newPost);
    res.status(201).json(newPost);
})

// Viết API cập nhật thông tin bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.put('/posts/:postId', (req, res) => {
    const postId = req.params.postId;
    const { content, isPublic } = req.body; 

    const postIndex = posts.findIndex(post => post.postId === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }
    if (posts[postIndex].userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: Only the creator of the post can update it' });
    }
    posts[postIndex].content = content || posts[postIndex].content;
    posts[postIndex].isPublic = isPublic !== undefined ? isPublic : posts[postIndex].isPublic;

    res.json(posts[postIndex]);
});

// Viết API xoá bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.delete('posts/:postId', (req, res) => {
    const postId = req.params.postId;
    const postIndex = posts.findIndex(post => post.postId === postId)
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' })
    }
    if (posts[postIndex].userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: Only the creator of the post can delete it' })
    }
    posts.splice(postIndex, 1)
    res.json({ message: 'Post deleted successfully' })
})

// Viết API tìm kiếm các bài post với content tương ứng được gửi lên từ query params.
app.get('/users/search', (req, res) => {
    const {content} = req.body
    if (!content) {
        return res.status(400).json({ message: 'No parameter' })
    }
    const matchingPosts = posts.filter(post => post.content.includes(content))
    res.json(matchingPosts)
})

// Viết API lấy tất cả các bài post với isPublic là true, false thì sẽ không trả về.
app.get('/posts/public', (req, res) => {
    const publicPosts = posts.filter(post => post.isPublic === true);
    res.json(publicPosts);
})

app.listen(8080, () => {
    console.log("server is running!");
})