const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
      users.push({
        "username": req.query.username,
        "password": req.query.password
    });
    // Send a success message as the response, indicating the user has been added
    res.send("Customer " + req.query.username + " successfully created. You can now login!");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4));
      }).then(data => res.send(data));
    //res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
          try {
            resolve(books[isbn]);
          } catch (error) {
            reject(error);
          }
        });
        res.send(book);
      } catch (error) {
        console.error(error);
        res.status(404).send('Book not found');
      }
    //res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const filtered_books = Object.values(books).filter(book => book.author === author);
        res.send(filtered_books);
      } catch (error) {
        console.error(error);
      }
    
    //const author = req.params.author;
    //let filtered_books = Object.values(books).filter(book => book.author === author);
    //res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const filtered_books = Object.values(books).filter(book => book.title === title);
        res.send(filtered_books);
      } catch (error) {
        console.error(error);
      }
    
    //const title = req.params.title;
    //let filtered_books = Object.values(books).filter(book => book.title === title);
    //res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.id;
    let book = Object.values(books).find(book => book.id === isbn);
    res.send(book.reviews);
});

module.exports.general = public_users;
