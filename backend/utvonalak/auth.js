const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Felhasznalo = require('../modellek/felhasznalo');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '500h';

// Helpful response for GET requests to /login so a browser visit doesn't hit the generic catch-all 404.
// We explicitly tell clients to use POST for authentication.
router.get('/login', (req, res) => {
    res.set('Allow', 'POST');
    return res.status(405).json({
        message: 'Method Not Allowed. Use POST to /api/auth/login with JSON body { felhasznalo, jelszo }.'
    });
});

router.post(
    '/login',
    [
        body('felhasznalo').trim().notEmpty().withMessage('Felhasználó kötelező!'),
        body('jelszo').notEmpty().withMessage('Jelszó nem lehet üres!')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { felhasznalo, jelszo } = req.body;

        try {
            // Megkeressük a felhasználót a felhasznalo mező alapján
            const user = await Felhasznalo.findOne({ felhasznalo });

            if (!user) return res.status(401).json({ message: 'Helytelen felhasz páros!' });

            const matched = await bcrypt.compare(jelszo, user.jelszoHash);
            if (!matched) return res.status(401).json({ message: 'Helytelen jelszó!' });

            const token = jwt.sign(
                { id: user._id, felhasznalo: user.felhasznalo, role: user.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES }
            );

            // Visszaadjuk a tokent és a felhasználó nevét
            res.json({ token, felhasznalo: user.felhasznalo, role: user.role });
        } catch (err) {
            console.error('Login hiba', err);
            res.status(500).json({ message: 'Szerver hiba' });
        }
    }
);

module.exports = router;