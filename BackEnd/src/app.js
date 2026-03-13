const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Code Reviewer API is running 🟢');
});

app.use('/auth', authRoutes);
app.use('/ai', aiRoutes);

module.exports = app;