'use strict'

/**
 * Routing of all views.
 */

const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

const prom = require('../monitoring/prometheus-util');

/* Routes */
router.get('/', viewController.mainView);
router.get('/metrics', prom.injectMetricsRoute);
router.get('/public', viewController.renderPublicTimeLine);
router.get('/home', viewController.renderPrivateTimeline);
router.get('/login', viewController.renderLoginPage);
router.post('/login/auth', viewController.loginButton);
router.get('/logout', viewController.logoutButton);
router.get('/signup', viewController.renderSignupPage);
router.post('/signup/create', viewController.signupButton);
router.post('/msg', viewController.postMessage);
router.get('/:username', viewController.renderUserTimeline);
router.get('/:username/follow', viewController.followButton);
router.get('/:username/unfollow', viewController.unfollowButton);


module.exports = router;