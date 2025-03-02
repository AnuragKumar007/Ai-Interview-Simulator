const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/questionGenerator', async (req, res) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    const jobDescription = req.body.description;

    try {
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Prepare the prompt for question generation
        const prompt = `Based on the following job description, generate 5 technical interview questions that would be appropriate for this role. Format the response as a JSON array of strings containing only the questions:
        
        Job Description: ${jobDescription}`;

        // Generate questions using Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse the response to get questions array
        let questions;
        try {
            questions = JSON.parse(text);
        } catch (error) {
            // If parsing fails, split by newlines and clean up
            questions = text.split('\n')
                .filter(line => line.trim().length > 0)
                .map(line => line.replace(/^\d+\.\s*/, '').trim());
        }

        res.json({ questions });
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

module.exports = router;
