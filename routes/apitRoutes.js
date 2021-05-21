const noteData = require('../data/noteData');

module.exports = (app) => {
    app.get('/api/notes', (req, res) => res.json(noteData));
    app.post('/api/notes', (req,res) => {
        if(noteData.title !== null) {
            if(noteData.textArea !== null) {
                noteData.push(req.body);
            }
        }
    })
    app.post('/api/clear', (req, res) => {
        // Empty out the arrays of data
        noteData.length = 0;
    
        res.json({ ok: true });
      });
}