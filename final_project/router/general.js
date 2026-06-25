const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

/* =========================
   TASK 10 - Get all books
========================= */
function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

public_users.get('/', function (req, res) {
  getBookList()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err }));
});

/* =========================
   TASK 11 - ISBN
========================= */
function getFromISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found!");
    }
  });
}

public_users.get('/isbn/:isbn', function (req, res) {
  getFromISBN(req.params.isbn)
    .then(data => res.json(data))
    .catch(err => res.status(404).json({ message: err }));
});

/* =========================
   TASK 12 - Author
========================= */
function getFromAuthor(author) {
  return new Promise((resolve, reject) => {
    let output = [];

    for (let isbn in books) {
      if (books[isbn].author === author) {
        output.push(books[isbn]);
      }
    }

    resolve(output);
  });
}

public_users.get('/author/:author', function (req, res) {
  getFromAuthor(req.params.author)
    .then(data => {
      if (data.length === 0) {
        return res.status(404).json({ message: "Author not found" });
      }
      res.json(data);
    })
    .catch(err => res.status(500).json({ message: err }));
});

/* =========================
   TASK 13 - Title
========================= */
function getFromTitle(title) {
  return new Promise((resolve, reject) => {
    let output = [];

    for (let isbn in books) {
      if (books[isbn].title === title) {
        output.push(books[isbn]);
      }
    }

    resolve(output);
  });
}

public_users.get('/title/:title', function (req, res) {
  getFromTitle(req.params.title)
    .then(data => {
      if (data.length === 0) {
        return res.status(404).json({ message: "Title not found" });
      }
      res.json(data);
    })
    .catch(err => res.status(500).json({ message: err }));
});

module.exports.general = public_users;