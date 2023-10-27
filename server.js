const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet'); // adds a bunch of standard security to server
const Book = require('./models/Book.js');
require('dotenv').config();
require('./config/db.js');
const PORT = 3000;


const app = express();


// START MIDDLEWARE //
app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(morgan('dev'));
app.use(helmet());
// END MIDDLEWARE //

// START ROUTES //


/* CREATE - Post */

// create 1 book
app.post('/book', async (req, res) => {
    let book = req.body.book;
    let dbResponse = await Book.create(book)
    res.send(dbResponse);
})

// create many books
app.post('/books', async (req, res) => {
    // in the request there should be an array of books objects.
    let books = req.body.books;
    let dbResponse = await Book.insertMany(books);
    res.send(dbResponse);
})



/* READ - Get */

// find all books
app.get('/books', async (req, res) => {
    let arrayOfBooks = await Book.find();
    if (arrayOfBooks) {
        console.log(arrayOfBooks);
        res.send(arrayOfBooks);
    }else {
        res.status(404).send(`Nothing to show`);
    }
})


// 6537fed65412e2d89888af95
// find a specific book by it's Id
app.get('/books/id/:bookId', async (req, res) => {
    let bookId = req.params.bookId
    let book = await Book.findById(bookId)
    if (book) {
        console.log(book);
        res.send(book)
    }else{
        res.status(404).send(`That book ID: ${bookId} cannot be found`);
    }
})

//find first book that matches criteria This will just find by first matching book name
app.get('/books/name/:name', async (req, res) => {
    let paramName = req.params.name;
    let firstBook = await Book.findOne({ title: `${paramName}` })
    if (firstBook) {
        res.send(firstBook)
    } else {
        res.status(404).send('Book not found');
    }
    // console.log(firstBook)

})


// UPDATE - POST

// app.post('')


// DELETE

// delete books by id
app.delete('/books/id/:bookId', async (req, res) => {
    let bookToDelete = req.params.bookId;
    let deleteBook = await Book.findByIdAndDelete(bookToDelete)
    if (deleteBook) {
        res.send(`You deleted: ${deleteBook}`);
    } else {
        res.status(404).send('Book not found or could not be deleted');
    }
})

// delete all books that do not have a title
app.delete('/books/no-title', async (req, res)=> {
    let booksWithNoTitle = {title: {$exists: false} }
    let deleteBookWithNoTitle = await Book.deleteMany(booksWithNoTitle)
    res.send(deleteBookWithNoTitle)
})


// END ROUTES //

app.listen(PORT, () => {
    console.log(`Server LIVE on port ${PORT}`);
});


