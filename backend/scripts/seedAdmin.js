// Usage: node backend/scripts/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const { MONGO_URI, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
if (!MONGO_URI || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Kérlek ellenőrizd a backend/.env -t és határozd meg MONGO_URI, ADMIN_USERNAME, ADMIN_PASSWORD-t');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'user' }
});

const Felhasznalo = mongoose.model('felhasználó', userSchema);

(async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Sikeres csatlakozás a MongoDB-hez');

        const exists = await Felhasznalo.findOne({ felhasznalo: ADMIN_USERNAME });
        if (exists) {
            console.log('Admin felhasználó már létezik:', ADMIN_USERNAME);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const user = new Felhasznalo({ felhasznalo: ADMIN_USERNAME, passwordHash, role: 'admin' });
        await user.save();
        console.log('Admin felhasz létrehozva:', ADMIN_USERNAME);
        process.exit(0);
    } catch (err) {
        console.error('Seeding hiba', err);
        process.exit(1);
    }
})();