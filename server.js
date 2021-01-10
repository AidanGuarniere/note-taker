// requirements
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { notes } = require("./db/notes.json");

// filter by query
function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;
  if (query.title) {
    filteredResults = filteredResults.filter(
      (note) => note.title === query.title
    );
  }
  if (query.text) {
    filteredResults = filteredResults.filter(
      (note) => note.text === query.text
    );
  }
  return filteredResults;
}

// filter by param
function findById(id, notesArray) {
  const result = notesArray.filter((note) => note.id === id)[0];
  return result;
}

// get notes.json through query
app.get("/api/notes", (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// get notes.json through param (id), 404 if not found
app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send(" Note not found!");
  }
});

// post notes.json 
app.post('/api/notes', (req, res) => {
    console.log(req.body);
    res.json(req.body);
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
