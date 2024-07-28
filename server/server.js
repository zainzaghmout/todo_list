require('dotenv').config();  
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const tokenBlacklist = [];


const app = express();
const Database = require('./Database');
const db = new Database();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }

    if (tokenBlacklist.includes(token)) {
        return res.sendStatus(403); // Token is blacklisted
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Signup
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.signup(username, password);
        res.status(201).send(user);
    } catch (err) {
        console.error('Signup error:', err);
        res.status(400).send(err.message);
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await db.login(username, password);
        res.status(200).json({ user, token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(400).send(err.message);
    }
});

// Sign-out
app.post('/signout', authenticateToken, (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        tokenBlacklist.push(token); // Add the token to the blacklist
        res.sendStatus(204); // No Content
    } else {
        res.sendStatus(401); // Unauthorized
    }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

// add notes
app.post('/notes', authenticateToken, (req, res) => {
    const body = req.body;
    body.userId = req.user.userId;

    db.addNote(body)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
});

// get notes
app.get('/notes', authenticateToken, (req, res) => {
    const { title } = req.query;
    const userId = req.user.userId;

    if (title) {
        db.getNotesByTitleAndUserId(title)
            .then(data => res.send(data))
            .catch(err => res.status(500).send(err));
    } else {
        db.getNotesByUserId()
            .then(data => res.send(data))
            .catch(err => res.status(500).send(err));
    }
});

// get notes by ID
app.get('/notes/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    db.getNoteByIdAndUserId(id, userId)
        .then(data => {
            if (!data) {
                res.status(404).send("Note not found or you don't have permission to access this note");
            } else {
                res.send(data);
            }
        })
        .catch(err => res.status(500).send(err));
});

// update notes
app.put('/notes/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    db.getNoteByIdAndUserId(id, req.user.userId)
        .then(note => {
            if (!note) {
                return res.status(404).send("Note not found or you don't have permission to update this note");
            }

            note.title = title || note.title;
            note.content = content || note.content;
            note.updatedDate = new Date();

            return note.save();
        })
        .then(updatedNote => res.send(updatedNote))
        .catch(err => res.status(500).send(err));
});

// delete note
app.delete('/notes/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.getNoteByIdAndUserId(id, req.user.userId)
        .then(note => {
            if (!note) {
                return res.status(404).send("Note not found or you don't have permission to delete this note");
            }

            return note.remove();
        })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});


const port = 3000;

app.listen(port, () => {
    console.log(`Server has started on the port ${port}...`);
    db.connect();
});