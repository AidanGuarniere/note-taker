// requirements
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { notes } = require('./db/notes.json')

// filter by query
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(notes => notes.title === query.title);
    }
    if (query.text) {
        filteredResults = filteredResults.filter(notes => notes.text === query.text);
    }
    return filteredResults;
}

// route to notes.json
app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    console.log(req.query)
    res.json(results);
  });

// // serve to index.html
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, ".public/index.html"));
// });

// // serve to notes.html 
// app.get("/notes", (req, res) => {
//     res.sendFile(path.join(__dirname, ".public/notes.html"));
//   });

// listen for PORT
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
