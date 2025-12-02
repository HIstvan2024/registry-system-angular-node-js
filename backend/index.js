const path = require('path');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authVonalak = require('./utvonalak/auth');
const termekVonalak = require('./utvonalak/termekek');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authVonalak);
app.use('/api/termekek', termekVonalak);
app.get('/api/health', (req, res) => res.json({ ok: true }));

// statikus frontend kiszolgálás
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist', 'frontend', 'browser');
app.use(express.static(frontendDist, { index: false }));

// angular kliensoldal kezeli az útvonalakat
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).end();
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// Basic env checks to avoid confusing runtime failures
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/regiszter';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('Missing JWT_SECRET environment variable. Set JWT_SECRET in backend/.env or the environment and restart.');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB csatlakozott');
        app.listen(PORT, () => console.log(`Fut a szerver: http://localhost:${PORT} -on`));
    })
    .catch(err => {
        console.error('MongoDB csatlakozási hiba:', err);
        process.exit(1);
    });