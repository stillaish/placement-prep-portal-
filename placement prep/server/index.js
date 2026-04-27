const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/planner', require('./routes/planner'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/roadmaps', require('./routes/roadmaps'));

app.get('/', (req, res) => {
  res.send('Placement Preparation Portal API');
});

// Database Connection
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/placement_prep';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
