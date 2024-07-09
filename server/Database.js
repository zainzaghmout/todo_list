const mongoose = require('mongoose');
const Note = require("./schemas/note");

class Database {
    constructor() {
        this.Url = "mongodb://localhost:27017/ToDO";
    }

    connect() {
        mongoose.connect(this.Url)
            .then(() => {
                console.log("Database connected successfully.");
            })
            .catch((err) => {
                console.log("Error in connecting to database", err);
            })
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

    getNotes() {
        return new Promise((resolve, reject) => {
            Note.find({})
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getNoteById(id) {
        return new Promise((resolve, reject) => {
            Note.findById(id)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
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

    getNotesByTitle(noteTitle){
        return new Promise((resolve, reject) => {
            const query = {title : {$regex: new RegExp(noteTitle, 'i')} };
            Note.find(query)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = Database;