const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Read bookmarks from file
function readBookmarks() {
    const data = fs.readFileSync('./bookmarks.json');
    const bookmarks = JSON.parse(data);
    return bookmarks;
}


// Write bookmarks to file
function writeBookmarks(bookmarks) {
    const data = JSON.stringify(bookmarks, null, 2);
    fs.writeFileSync('./bookmarks.json', data);
}

// Get all bookmarks
app.get('/api/bookmarks', (req, res) => {
    const bookmarks = readBookmarks();
    res.json(bookmarks);
});

// Get a single bookmark by name
app.get('/api/bookmarks/:name', (req, res) => {
    const name = req.params.name;
    const bookmarks = readBookmarks();
    const bookmark = bookmarks.find(b => b.name === name);
    if (!bookmark) {
        res.status(404).send(`Bookmark ${name} not found`);
    } else {
        res.json(bookmark);
    }
});

// Create a new bookmark
app.post('/api/bookmarks', (req, res) => {
    const bookmarks = readBookmarks();
    const bookmark = req.body;
    bookmarks.push(bookmark);
    writeBookmarks(bookmarks);
    res.json(bookmark);
});

// Update an existing bookmark by name
app.put('/api/bookmarks/:name', (req, res) => {
    const name = req.params.name;
    const bookmarks = readBookmarks();
    const bookmarkIndex = bookmarks.findIndex(b => b.name === name);
    if (bookmarkIndex === -1) {
        res.status(404).send(`Bookmark ${name} not found`);
    } else {
        const newBookmark = req.body;
        bookmarks[bookmarkIndex] = { ...bookmarks[bookmarkIndex], ...newBookmark };
        writeBookmarks(bookmarks);
        res.json(bookmarks[bookmarkIndex]);
    }
});


// Delete a bookmark by name
app.delete('/api/bookmarks/:name', (req, res) => {
    console.log("In deel")
    const name = req.params.name;
    const bookmarks = readBookmarks();
    const bookmarkIndex = bookmarks.findIndex(b => b.name === name);
    if (bookmarkIndex === -1) {
        res.status(404).send(`Bookmark ${name} not found`);
    } else {
        bookmarks.splice(bookmarkIndex, 1);
        writeBookmarks(bookmarks);
        res.sendStatus(204);
    }
});

// Display bookmarks which satisifies the pattern
app.get('/api/bookmark/single/search', (req, res) => {
    const searchTerm = req.query.term.toLowerCase();
    const bookmarks = readBookmarks();
    const filteredBookmarks = bookmarks.filter((bookmark) => {
        return bookmark.name.toLowerCase().includes(searchTerm)||bookmark.url.toLowerCase().includes(searchTerm);
    });
    res.json(filteredBookmarks);
});

// Serve HTML front-end
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
