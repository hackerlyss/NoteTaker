// Dependencies
const express = require('express');
const fs = require('fs');
const noteData = require('./db/db.json');
// set up express server and initial port
const app = express();
const PORT = process.env.PORT || 3000;

// set up express for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Router
require('./routes/htmlRoutes')(app);

app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', (req,res) => {
   let newNotes= req.body;
   let lastID = 0;
   for (let i=0; i< noteData; i++) {
     let noteID = noteData[i];
      if (noteID.id > lastID) {
        lastID = noteID.id;
         }
    }
    newNotes.id = lastID + 1;
    noteData.push(newNotes);
    fs.writeFile('./db/db.json', JSON.stringify(noteData), function (err)  {
       if (err) {
          return console.log(err);
       } else {
          console.log('Note saved')
        }
    });
    res.json(newNotes);
});
app.delete('/api/notes/:id', (req, res) => {
    for (let i = 0; i < noteData.length; i++) {

        if (noteData[i].id == req.params.id) {
            noteData.splice(i, 1);

        }
    }

    fs.writeFile('./db/db.json', JSON.stringify(noteData), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log('Note deleted');
        }
    });

    res.json(noteData);
});

//listener to start server

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT)
});