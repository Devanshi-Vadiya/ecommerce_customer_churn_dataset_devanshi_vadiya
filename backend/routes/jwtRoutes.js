const express = require('express');
const router = express.Router();
const jc = require('../controllers/jwtController');
const jwtAuth = require('../middleware/jwtAuth');

// Public JWT routes
router.post('/generate-token', jc.generateToken);
router.post('/verify-token', jc.verifyToken);
router.post('/refresh-token', jc.refreshToken);
router.delete('/revoke-token', jc.revokeToken);

// Protected JWT routes
router.get('/profile', jwtAuth, jc.jwtProfile);
router.get('/dashboard', jwtAuth, jc.jwtDashboard);
router.get('/private-customers', jwtAuth, jc.privateCustomers);
router.get('/private-stats', jwtAuth, jc.privateStats);
router.get('/admin', jwtAuth, jc.jwtAdmin);
router.get('/customer-insights', jwtAuth, jc.customerInsights);

// OPTIONS
router.options('/profile', (req, res) => { res.set('Allow', 'GET, OPTIONS').json({ methods: ['GET', 'OPTIONS'] }); });

module.exports = router;
