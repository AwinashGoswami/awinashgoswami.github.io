const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const Session = require('./models/Session');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// POST /chat
app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    let sid = sessionId || uuidv4();
    let session = await Session.findOne({ sessionId: sid });

    if (!session) {
        session = await Session.create({ sessionId: sid, messages: [] });
    }

    // Add user message
    session.messages.push({
        role: 'user',
        content: message
    });

    try {
        // Convert to Gemini format
        const contents = session.messages.map(msg => ({
            parts: [{ text: msg.content }]
        }));

        console.log("contents:", contents);

        const response = await axios.post(
            `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
            { contents }
        );

        const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

        // Save model response
        session.messages.push({ role: 'model', content: reply });
        await session.save();

        res.json({ reply, sessionId: sid });
    } catch (error) {
        console.error("Gemini error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Error from Gemini API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
