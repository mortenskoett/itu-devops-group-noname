'use strict'

/**
 * Routing of all views.
 * Endpoint: '/view'
 */

const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

/* Routes */
router.get('/', viewController.mainView);
router.get('/view/public', viewController.renderPublicTimeLine);
router.get('/view/home', viewController.renderPrivateTimeline);
router.get('/view/login', viewController.renderLoginPage);
router.post('/view/login/auth', viewController.loginButton);
router.get('/view/logout', viewController.logoutButton);
router.get('/view/signup', viewController.renderSignupPage);
router.post('/view/signup/create', viewController.signupButton);
router.post('/view/message/post', viewController.newMessageButton);
router.get('/view/user/:username', viewController.renderUserTimeline);
router.get('/view/user/:username/follow', viewController.followButton);
router.get('/view/user/:username/unfollow', viewController.unfollowButton);
router.get('/view/flag_tool', viewController.flag_tool);

module.exports = router;