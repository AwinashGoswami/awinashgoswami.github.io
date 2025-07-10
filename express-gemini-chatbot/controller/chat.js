
const chat = async (req, res) => {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    let sid = sessionId || uuidv4();
    let session = await Session.findOne({ sessionId: sid });

    if (!session) {
        session = await Session.create({ sessionId: sid, messages: [] });
    }

    // Add user message
    session.messages.push({ role: 'user', content: message });

    try {
        // Convert to Gemini format
        const contents = session.messages.map(msg => ({
            role: msg.role, // 'user' or 'model'
            parts: [{ text: msg.content }]
        }));


        const response = await axios.post(
            `${process.env.GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
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
}