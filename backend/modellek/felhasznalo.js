const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['felhasznalo', 'admin'], default: 'felhasznalo' }
}, { timestamps: true });

module.exports = mongoose.model('felhasználó', userSchema);