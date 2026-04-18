const User = require('../models/user.model');

// ─── @desc    Get homepage data for authenticated user
// ─── @route   GET /api/home
// ─── @access  Private
const getHomeData = async (req, res, next) => {
  try {
    const user = req.user;

    // Here you'll expand with your actual homepage data
    // (missions, stats, activity feed, etc.)
    res.json({
      success: true,
      data: {
        user: user.toPublicJSON(),
        meta: {
          greeting: getGreeting(user.name),
          lastLogin: user.lastLogin,
        },
        // Placeholder sections — replace with real DB queries
        stats: {
          totalMissions: 0,
          activeMissions: 0,
          completedMissions: 0,
        },
        recentActivity: [],
        announcements: [],
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── @desc    Get public homepage info (landing page)
// ─── @route   GET /api/home/public
// ─── @access  Public
const getPublicHomeData = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        appName: 'Ghost Protocol',
        tagline: 'Operate in the shadows.',
        features: [
          { id: 1, title: 'Secure Ops', description: 'End-to-end encrypted missions.' },
          { id: 2, title: 'Zero Trace', description: 'No footprints, no logs.' },
          { id: 3, title: 'Real-time Intel', description: 'Live data feeds from the field.' },
        ],
        stats: {
          activeAgents: await User.countDocuments({ role: 'user' }),
          launchDate: '2024',
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getGreeting = (name) => {
  const hour = new Date().getHours();
  const firstName = name?.split(' ')[0] || 'Agent';
  if (hour < 12) return `Good morning, ${firstName}.`;
  if (hour < 18) return `Good afternoon, ${firstName}.`;
  return `Good evening, ${firstName}.`;
};

module.exports = { getHomeData, getPublicHomeData };
