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

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/regiszter';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB csatlakozott');
        app.listen(PORT, () => console.log(`Fut a szerver: http://localhost:${PORT} -on`));
    })
    .catch(err => {
        console.error('MongoDB csatlakozási hiba:', err);
        process.exit(1);
    });