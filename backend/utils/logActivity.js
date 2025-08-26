const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, action, targetType, targetId, details) => {
    if (req.user && req.user.role === 'admin') {
        try {
            await ActivityLog.create({
                admin: req.user._id,
                adminName: req.user.name,
                action,
                targetType,
                targetId,
                details,
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    }
};

module.exports = logActivity;
