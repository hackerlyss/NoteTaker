// Dependencies
const express = require('express');
const path = require('path');
// set up express server and initial port
const app = express();
const PORT = process.env.PORT || 3000;

// set up express for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Router
require('./routes/htmlRoutes')(app);
require('./routes/apitRoutes')(app);

//listener to start server

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT)
});