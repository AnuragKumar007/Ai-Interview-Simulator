const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/questionGenerator', async (req, res) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    // console.log(API_KEY);
    const jobDescription = req.body.description;

    // console.log(jobDescription);
    try{
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
        });
        const prompt = `Based on the following job description, generate 5 technical interview questions that would be appropriate for this role. Format the response as a JSON array of strings containing only the questions:
        Job Description: ${jobDescription}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        console.log(result);
        console.log(response);
        
        try {
            // Try to parse the response as JSON
            const questions = JSON.parse(text);
            return res.json({ questions });
        } catch (parseError) {
            // If parsing fails, send the text as a single question
            console.error('Failed to parse JSON response:', parseError);
            return res.json({ questions: [text] });
        }

    }catch(error){
        console.error('Error generating questions:', error);
        return res.status(500).json({ error: 'Failed to generate questions' });
    }
});

module.exports = router;
