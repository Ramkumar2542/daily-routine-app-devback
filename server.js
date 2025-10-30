const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/mydb')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// ✅ Sample Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model('User', UserSchema);

// ✅ Test Route
app.get('/', (req, res) => {
  res.send("Node.js + MongoDB Server Working 🚀");
});

// ✅ Create User API
app.post('/user', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// ✅ Start Server
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
