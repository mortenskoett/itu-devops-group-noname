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
router.get('/view/home', viewController.renderUserTimeline);
router.get('/view/login', viewController.renderLoginPage);
router.post('/view/login/auth', viewController.loginButton);
router.get('/view/logout', viewController.logoutButton);
router.get('/view/signup', viewController.renderSignupPage);
router.post('/view/signup/create', viewController.signupButton);

module.exports = router;