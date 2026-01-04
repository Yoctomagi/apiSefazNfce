const express = require('express');
const router = express.Router();
const nfceController = require('../controllers/nfceController');

router.post('/emitir', nfceController.emitirNfce);

module.exports = router;
