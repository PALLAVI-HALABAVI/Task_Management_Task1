const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');


router.post('/create', async (req, res) => {
  try {
    const { taskId, participants, meetingLink, meetingTime } = req.body;
    if (!meetingLink) return res.status(400).json({ error: 'Meeting link is required' });

    const meeting = new Meeting({ taskId, participants, meetingLink, meetingTime });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().populate('taskId participants');
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const meetings = await Meeting.find({ participants: userId }).populate('taskId participants');
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
