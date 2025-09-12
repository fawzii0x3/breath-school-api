const controller = require('../controllers/user.controller')
const { Router } = require('express')
const { authorize, ADMIN, LOGGED_USER } = require('../utils/auth');
const { firebaseAuth, optionalFirebaseAuth } = require('../middleware/firebaseAuth');
let router = Router()

// Firebase authentication route - validates token and creates user if needed
router
    .route('/auth/firebase')
    .post(firebaseAuth, (req, res) => {
        res.json({
            success: true,
            message: 'Firebase authentication successful',
            user: req.user,
            firebaseUser: req.firebaseUser
        });
    });

// Get current user profile
router
    .route('/me')
    .get(firebaseAuth, controller.getOne)

// Delete current user account
router
    .route('/delete')
    .delete(firebaseAuth, controller.deleteUser)

// Get user by email (public endpoint)
router
    .route('/users/:email')
    .get(controller.getUserByEmail)

// Update user subscription status
router
    .route('/updateSubscriptionStatus')
    .put(firebaseAuth, controller.updateSubscriptionStatus)

// Add music to favorites
router
    .route('/add-favorite/music/:music')
    .put(firebaseAuth, controller.addFavoriteMusic)

// Add video to favorites
router
    .route('/add-favorite/video/:video')
    .put(firebaseAuth, controller.addFavoriteVideo)

// Check and create user (creates in both MongoDB and Systeme.io)
router
    .route('/check-and-create/:email')
    .get(controller.getUserByEmail)

module.exports = router