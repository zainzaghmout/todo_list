require('dotenv').config();
const mongoose = require('mongoose');
const Note = require("./schemas/note");
const User = require("./schemas/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

class Database {
    constructor() {
        this.Url = process.env.MONGODB_URI;
    }

    connect() {
        mongoose.connect(this.Url)
            .then(() => {
                console.log("Database connected successfully.");
            })
            .catch((err) => {
                console.log("Error in connecting to database", err);
            });
    }

    addNote(note) {
        return new Promise((resolve, reject) => {
            note["createdDate"] = new Date();
            note["updatedDate"] = new Date();

            let newNote = new Note(note);
            newNote.save()
                .then(doc => {
                    resolve(doc);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getNotesByUserId(userId) {
        return new Promise((resolve, reject) => {
            Note.find({ userId })
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    getNoteByIdAndUserId(id, userId) {
        return new Promise((resolve, reject) => {
            Note.findOne({ _id: id, userId })
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    getNotesByTitleAndUserId(title, userId) {
        return new Promise((resolve, reject) => {
            const query = { title: { $regex: new RegExp(title, 'i') }, userId };
            Note.find(query)
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    updateNote(note) {
        return new Promise((resolve, reject) => {
            note["updatedDate"] = new Date();
            Note.findByIdAndUpdate(note["_id"], note)
            .then(data => {
                console.log(data);
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    deleteNote(id) {
        return new Promise((resolve, reject) => {
            Note.findByIdAndDelete(id)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    async signup(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        return user.save();
    }

    async login(username, password) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        return { user, token };
    }
}


module.exports = Database;