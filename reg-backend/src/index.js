import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'cyberpunk_secret_key_2077';

// CORS Configuration - Update with your Vercel URL after deployment
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://reg-number-plate.vercel.app',  // Update with your actual Vercel URL
    // Add your custom domain here if you have one
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
};

// Root Route
app.get('/', (req, res) => {
    res.send('<h1>Cyberpunk Registration API</h1><p>Backend is online. Use <a href="http://localhost:5173">http://localhost:5173</a> to access the Frontend.</p>');
});

// MongoDB Connection Events
mongoose.connection.on('error', err => console.error('[DATABASE] Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.log('[DATABASE] Disconnected from MongoDB Atlas'));


// Schemas
const registrationSchema = new mongoose.Schema({
    regNum: String,
    owner: String,
    ownerEmail: String,
    type: String,
    model: String,
    manufacturer: String,
    state: String,
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, default: 'Active' },
    chassis: String,
    engine: String
});

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    joined: { type: String, default: () => new Date().toISOString().split('T')[0] },
    history: [{
        date: { type: String, default: () => new Date().toLocaleString() },
        event: String,
        detail: String
    }]
});

const vehicleTypeSchema = new mongoose.Schema({
    name: String,
    baseReg: String,
    id: String
});

const historySchema = new mongoose.Schema({
    date: { type: String, default: () => new Date().toLocaleString() },
    event: String,
    detail: String,
    userEmail: String
});

const Registration = mongoose.model('Registration', registrationSchema);
const User = mongoose.model('User', userSchema);
const VehicleType = mongoose.model('VehicleType', vehicleTypeSchema);
const History = mongoose.model('History', historySchema);

// API Endpoints

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Block unauthorized admin registration
        if (role === 'admin' && email !== 'admin@email.com') {
            return res.status(403).json({ error: 'Identity upgrade restricted. Admin status requires neural verification.' });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'User identity already exists in database.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || 'user' });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET);
        res.status(201).json({ user: { name: newUser.name, email: newUser.email, role: newUser.role }, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Identifier not found.' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid access key (Wrong password).' });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET);
        res.json({ user: { name: user.name, email: user.email, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Registrations
app.get('/api/registrations', authenticateToken, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query = { ownerEmail: req.user.email };
        }
        const regs = await Registration.find(query);
        res.json(regs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Registrations
app.post('/api/registrations', authenticateToken, async (req, res) => {
    try {
        const newReg = new Registration({ ...req.body, ownerEmail: req.user.email });
        await newReg.save();

        const activity = {
            event: 'Registration Generated',
            detail: `ID: ${newReg.regNum}`,
            date: new Date().toLocaleString()
        };

        // Update User History
        await User.findOneAndUpdate(
            { email: req.user.email },
            { $push: { history: activity } }
        );

        // Global History
        const globalActivity = new History({
            ...activity,
            userEmail: req.user.email
        });
        await globalActivity.save();

        res.status(201).json(newReg);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/registrations/:id', authenticateToken, async (req, res) => {
    try {
        const reg = await Registration.findById(req.params.id);
        if (!reg) return res.status(404).json({ error: 'Registration not found.' });

        if (req.user.role !== 'admin' && reg.ownerEmail !== req.user.email) {
            return res.status(403).json({ error: 'Unauthorized to delete this record.' });
        }

        await Registration.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vehicle Types (Public list, Admin changes)
app.get('/api/vehicle-types', async (req, res) => {
    try {
        const types = await VehicleType.find();
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/vehicle-types', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only.' });
    try {
        const typeId = req.body.name.toLowerCase().replace(/\s+/g, '-');
        const newType = new VehicleType({ ...req.body, id: typeId });
        await newType.save();
        res.status(201).json(newType);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/vehicle-types/:id', async (req, res) => {
    try {
        await VehicleType.deleteOne({ id: req.params.id });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// History
app.get('/api/history', authenticateToken, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query = { userEmail: req.user.email };
        }
        const hist = await History.find(query).sort({ _id: -1 });
        res.json(hist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// History Modification (Admin Only)
app.put('/api/history/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Restricted to administrators.' });
    try {
        const updated = await History.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin User List
app.get('/api/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Restricted access.' });
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const existing = await User.findOne({ email: req.body.email });
        if (existing) return res.status(200).json(existing);

        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only.' });
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed Data
const seedData = async () => {
    // Seed Vehicle Types
    const defaultTypes = [
        { id: 'car', name: 'Car', baseReg: 'CA' },
        { id: 'bike', name: 'Motorcycle/Bike', baseReg: 'BI' },
        { id: 'truck', name: 'Truck', baseReg: 'TR' },
        { id: 'bus', name: 'Bus', baseReg: 'BU' },
        { id: 'tractor', name: 'Tractor', baseReg: 'TC' },
        { id: 'ev', name: 'Electric Vehicle', baseReg: 'EV' },
        { id: 'autorickshaw', name: 'Auto Rickshaw', baseReg: 'AR' },
        { id: 'scooter', name: 'Scooter', baseReg: 'SC' },
        { id: 'moped', name: 'Moped', baseReg: 'MP' },
        { id: 'trailer', name: 'Trailer', baseReg: 'TL' },
        { id: 'crane', name: 'Crane/JCB', baseReg: 'CR' },
        { id: 'ambulance', name: 'Ambulance', baseReg: 'AM' },
        { id: 'fire-truck', name: 'Fire Engine', baseReg: 'FE' },
        { id: 'tanker', name: 'Tanker', baseReg: 'TK' },
        { id: 'van', name: 'Van/Mini Bus', baseReg: 'VN' },
        { id: 'luxury', name: 'Luxury Sedan', baseReg: 'LX' }
    ];

    for (const type of defaultTypes) {
        await VehicleType.findOneAndUpdate(
            { id: type.id },
            { $setOnInsert: type },
            { upsert: true, new: true }
        );
    }
    console.log('[DATABASE] Vehicle Types validation complete.');

    // Seed Admin User
    const adminEmail = 'admin@email.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        const adminUser = new User({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        await adminUser.save();
        console.log('[DATABASE] Primary Admin seeded.');
    }
};

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000
    })
        .then(() => {
            console.log('[DATABASE] Connected to MongoDB Atlas');
            seedData();
        })
        .catch(err => {
            console.error('[DATABASE] Fatal Connection Error:', err.message);
            console.warn('[DATABASE] TIP: Check if your IP address is whitelisted in MongoDB Atlas.');
        });
} else {
    console.error('[DATABASE] MONGODB_URI is missing from .env file.');
}

app.listen(PORT, () => {
    console.log(`[SERVER] Cyberpunk Backend Online: http://localhost:${PORT}`);
});
