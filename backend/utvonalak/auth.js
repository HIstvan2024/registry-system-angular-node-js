const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Felhasznalo = require('../modellek/felhasznalo');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '500h';

router.post(
    '/login',
    [
        body('felhasználó').trim().notEmpty().withMessage('Felhasználó kötelező!'),
        body('jelszó').notEmpty().withMessage('Jelszó nem lehet üres!')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username: felhasznalo, password: jelszo } = req.body;
        try {
            const user = await Felhasznalo.findOne({ felhasznalo });
            if (!user) return res.status(401).json({ message: 'Helytelen felhasz páros!' });

            const matched = await bcrypt.compare(jelszo, user.passwordHash);
            if (!matched) return res.status(401).json({ message: 'Helytelen pw páros!' });

            const token = jwt.sign({ id: user._id, felhasznalo: user.felhasznalo, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
            res.json({ token, felhasznalo: user.felhasznalo, role: user.role });
        } catch (err) {
            console.error('Login hiba', err);
            res.status(500).json({ message: 'Szerver hiba' });
        }
    }
);

module.exports = router;