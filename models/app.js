const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models/index').sequelize;
const User = require('./models/User');
const Song = require('./models/Song');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// File upload setup
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes

// User registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    try {
        const user = await User.create({ username, email, password: hashedPassword });
        res.json({ user });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Upload a song
app.post('/upload', upload.single('song'), async (req, res) => {
    const { title, artist, album, duration } = req.body;
    const filePath = `/uploads/${req.file.filename}`;
    try {
        const song = await Song.create({ title, artist, album, duration, file_path: filePath });
        res.json({ song });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all songs
app.get('/songs', async (req, res) => {
    const songs = await Song.findAll();
    res.json(songs);
});

// Play a song
app.get('/play/:id', async (req, res) => {
    const song = await Song.findByPk(req.params.id);
    if (song) {
        res.sendFile(path.join(__dirname, 'public', song.file_path));
    } else {
        res.status(404).send("Song not found");
    }
});

// Sync database and start server
sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
});
