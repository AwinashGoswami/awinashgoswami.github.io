const express = require('express');
const router = express.Router();

router.post('/chat', chat);

module.exports = router;