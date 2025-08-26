const ActivityLog = require('../models/ActivityLog');

const getActivities = async (req, res) => {
    try {
        const activities = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getActivities };
