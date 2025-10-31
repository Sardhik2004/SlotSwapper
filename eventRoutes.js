const express = require('express');
const router = express.Router();
const { createEvent, getMyEvents, updateEvent, deleteEvent } = require('../controllers/eventController');

router.post('/', createEvent);
router.get('/', getMyEvents);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
