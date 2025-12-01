const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../modellek/termek');
const auth = require('../hid/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const termek = await Product.find().sort({ createdAt: -1 });
        res.json(termek);
    } catch (err) {
        console.error('Hiba a termék kérése során', err);
        res.status(500).json({ message: 'Szerver hiba!' });
    }
});

router.post(
    '/',
    auth,
    [
        body('nev').trim().notEmpty().withMessage('Név Kötelező'),
        body('ar').notEmpty().withMessage('Ár kötelező').isFloat({ min: 0 }).withMessage('Ár egy olyan szám, amely >= 0'),
        body('mennyiseg').notEmpty().withMessage('Mennyiség kötelező').isInt({ min: 0 }).withMessage('Mennyiség egy integer típusú változó, amely >= 0'),
        body('sku').optional().trim()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name: nev, sku, price: ar, quantity: mennyiseg, description: leiras } = req.body;
        try {
            const query = [{ name: nev }];
            if (sku) query.push({ sku });
            const existing = await Product.findOne({ $or: query });
            if (existing) return res.status(409).json({ message: 'Termék ugyanazzal a névvel vagy SKU-val már létezik!' });

            const p = new Product({ name: nev, sku, price: ar, quantity: mennyiseg, description: leiras });
            await p.save();
            res.status(201).json(p);
        } catch (err) {
            if (err.code === 11000) return res.status(409).json({ message: 'Ismétlődő kulcs hiba!' });
            console.error('Hiba a termék készítésekor', err);
            res.status(500).json({ message: 'Szerver hiba!' });
        }
    }
);

module.exports = router;