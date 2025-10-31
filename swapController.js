const mongoose = require('mongoose');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

const getSwappableSlots = async (req, res) => {
  try {
    const slots = await Event.find({ status: 'SWAPPABLE', owner: { $ne: req.user._id } }).populate('owner','name email');
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const mySlot = await Event.findById(mySlotId).session(session);
    const theirSlot = await Event.findById(theirSlotId).session(session);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'One or both slots not found' });
    }
    if (!mySlot.owner.equals(req.user._id)) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'mySlot must belong to requester' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });
    }
    const swap = await SwapRequest.create([{
      mySlotId: mySlot._id,
      theirSlotId: theirSlot._id,
      requester: req.user._id,
      owner: theirSlot.owner,
      status: 'PENDING'
    }], { session });
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save({ session });
    await theirSlot.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json(swap[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const respondToSwap = async (req, res) => {
  const { id } = req.params;
  const { accept } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const swap = await SwapRequest.findById(id).session(session);
    if (!swap) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Swap request not found' });
    }
    if (!swap.owner.equals(req.user._id)) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized to respond' });
    }
    const mySlot = await Event.findById(swap.mySlotId).session(session);
    const theirSlot = await Event.findById(swap.theirSlotId).session(session);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Slot(s) missing' });
    }
    if (accept) {
      const requesterId = swap.requester;
      const ownerId = swap.owner;
      mySlot.owner = ownerId;
      theirSlot.owner = requesterId;
      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';
      swap.status = 'ACCEPTED';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await swap.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.json({ message: 'Swap accepted', swap });
    } else {
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      swap.status = 'REJECTED';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await swap.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.json({ message: 'Swap rejected', swap });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getIncomingOutgoing = async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ owner: req.user._id }).populate('mySlotId theirSlotId requester').sort({ createdAt: -1 });
    const outgoing = await SwapRequest.find({ requester: req.user._id }).populate('mySlotId theirSlotId owner').sort({ createdAt: -1 });
    res.json({ incoming, outgoing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSwappableSlots, createSwapRequest, respondToSwap, getIncomingOutgoing };
