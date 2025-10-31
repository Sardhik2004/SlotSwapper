const Event = require('../models/Event');

const createEvent = async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  try {
    const ev = await Event.create({
      title, startTime, endTime, status: status || 'BUSY', owner: req.user._id
    });
    res.status(201).json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not your event' });
    Object.assign(ev, payload);
    await ev.save();
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not your event' });
    await ev.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createEvent, getMyEvents, updateEvent, deleteEvent };
