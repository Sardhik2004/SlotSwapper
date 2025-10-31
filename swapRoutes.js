const express = require('express');
const router = express.Router();
const { getSwappableSlots, createSwapRequest, respondToSwap, getIncomingOutgoing } = require('../controllers/swapController');

router.get('/swappable-slots', getSwappableSlots);
router.post('/swap-request', createSwapRequest);
router.post('/swap-response/:id', respondToSwap);
router.get('/requests', getIncomingOutgoing);

module.exports = router;
