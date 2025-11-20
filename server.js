const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static('public')); // Serve static files from the "public" folder

// Serve GBA ROMs
app.get('/roms/:name', (req, res) => {
    const romName = req.params.name;
    const romPath = path.join(__dirname, 'roms', romName);

    res.sendFile(romPath, (err) => {
        if (err) {
            res.status(err.status).end();
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
