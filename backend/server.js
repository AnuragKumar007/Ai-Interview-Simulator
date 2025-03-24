// This is App.js file 

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const questionGeneratorService = require('./services/QuestionGenerator');
const interviewAnalyzerService = require('./services/InterviewAnalyzer');
// const audioTranscriptionService = require('./services/AudioTranscriptionService');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Interview-Simulator';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', questionGeneratorService);
app.use('/api/services', interviewAnalyzerService);
// app.use('/api', audioTranscriptionService);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
