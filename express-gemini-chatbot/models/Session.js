const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    messages:
        [
            {
                role: {
                    type: String,
                    enum: ['user', 'model'],
                    required: true
                },
                content: {
                    type: String,
                    required: true
                }
            }
        ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', sessionSchema);
