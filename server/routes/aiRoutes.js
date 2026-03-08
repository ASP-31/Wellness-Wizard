const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController'); // Capital 'C'
const ScanHistory = require('../models/ScanHistory');
// Define the POST endpoint for scanning
router.post('/analyze', aiController.analyzeFood);

module.exports = router;