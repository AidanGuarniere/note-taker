// requirements
const fs = require("fs");
const path = require("path");
const express = require("express");
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

// filter by param (id)
function findById(id, notesArray) {
  const result = notesArray.filter((note) => note.id === id)[0];
  return result;
}

// create new note in notes.json
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/notes.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

// validate new note
function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}

// GET notes.json through query
app.get("/api/notes", (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// GET notes.json through param (id), 404 if not found
app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send(" Note not found!");
  }
});

// POST notes.json
app.post("/api/notes", (req, res) => {
  req.body.id = notes.length.toString();

  if (!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

// serve to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".public/index.html"));
});

// serve to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, ".public/notes.html"));
  });

// listen for PORT
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
