const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: String,
    pages: Number
},
{
    timestamps: true
})

//                           Book  > books collection
const Book = mongoose.model('Book', bookSchema)
module.exports = Book;