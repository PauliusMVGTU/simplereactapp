const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User'); //importuojame user.js

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/labwork_db')
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch(err => console.error("❌ Connection error:", err));

// --- CRUD ---

//sukuriame nauja vartotoja
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//nuskaitome visus vartotojus
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

//keiciame vartotojo duomenis pagal ID
app.put('/api/users/:id', async (req, res) => {
    try {
        const updatedUser = await axios.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//istriname vartotoja pagal ID
app.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
});

app.listen(5000, () => console.log("🚀 Server is running on port 5000"));