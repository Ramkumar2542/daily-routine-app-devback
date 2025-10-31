require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);


// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/daily-routine')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// ✅ Test Route
app.get('/', (req, res) => {
  res.send("Node.js + MongoDB Server Working 🚀");
});

// ✅ Create User API
app.post('/user', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});
console.log("JWT Secret:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");
// ✅ Start Server
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
