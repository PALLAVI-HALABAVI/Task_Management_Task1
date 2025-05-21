const Meeting = require('../models/Meeting'); 

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('taskIds', 'title') 
      .populate('assignedTo', 'name email'); 

    res.status(200).json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
};

module.exports = { getMeetings };
