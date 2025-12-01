const mongoose = require('mongoose');

const termekSema = new mongoose.Schema({
    nev: { type: String, required: true, unique: true, trim: true },
    sku: { type: String, unique: true, sparse: true },
    ar: { type: Number, required: true, min: 0 },
    mennyiseg: { type: Number, required: true, min: 0 },
    leiras: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Termék', termekSema);