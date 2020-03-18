
/**
 * Controller to handle interaction using views of the web application.
 */

const express = require('express');

const router = express.Router();
const messageRepository = require('../repositories/messageRepository');
const userRepository = require('../repositories/userRepository');

async function mainView(req, res) {
  console.log('mainview called');

  // User already logged in
  if (req.session.loggedin) {
    console.log('/home');
    res.redirect('/home');
  } else { // Unkown user
    console.log('/public');
    res.redirect('/public');
  }
}


function renderTimeline(req, res, msgs) {
  res.render('pages/timeline', {
    messages: msgs,
    username: req.session.username,
    loggedin: req.session.loggedin,
  });
}

async function renderPublicTimeLine(req, res) {
  console.log('renderPublicTimeline called');

  const amount = (req.param.amount) ? req.param.amount : 50;

  const allMessages = await messageRepository.getAllMessages(amount);

  if (!allMessages) {
    res.status(500).send({ url: `${req.originalUrl}Error getting messages.` });
    res.end();
  }

  if (req.session.loggedin) {
    for (let i = 0; i < allMessages.length; i += 1) {
      const m = allMessages[i];
      const msgUserId = userRepository.getUserID(m.user.username);
      if (userRepository.following(req.session.userid, msgUserId.id)) {
        m.following = true;
      } else {
        m.following = false;
      }
      allMessages[i] = m;
    }
  }

  renderTimeline(req, res, allMessages);
  res.end();
}

async function renderPrivateTimeline(req, res) {
  console.log('renderPrivateTimeline called');

  if (!req.session.loggedin) {
    res.status(403).send({ url: `${req.originalUrl} : Unauthorized user not logged in.` });
  }

  const userId = req.session.userid;

  const followedMessages = await messageRepository.getFollowedMessages(userId, 30);

  if (!followedMessages) {
    res.status(500).send({ url: `${req.originalUrl}Error getting messages.` });
    res.end();
  }

  for (let i = 0; i < followedMessages.length; i += 1) {
    followedMessages[i].following = true;
  }

  renderTimeline(req, res, followedMessages);
  res.end();
}

async function postMessage(req, res) {
  console.log('postMessage called');

  if (!req.session.loggedin) {
    res.status(401)
      .send({ url: `${req.originalUrl} : Unauthorized: user not logged in.` })
      .end();
  }

  const { message } = req.body;
  const userId = req.session.userid;

  try {
    await messageRepository.postMessage(userId, message);
    res.redirect('/home');
  } catch (err) {
    console.log(err);
    res.status(401).send({ url: `${req.originalUrl} : ${err}` });
  }
}

async function renderUserTimeline(req, res) {
  console.log('renderUserTimeline called');

  if (!(req.session.loggedin || req.session.userid)) {
    res.redirect('/login');
    return;
  }

  const { username } = req.params;

  const user = await userRepository.getUserID(username);
  const messages = await messageRepository.getUserMessages(user.id, 30);
  const following = await userRepository.following(req.session.userid, user.id);
  res.render('pages/user', {
    messages,
    loggedin: req.session.loggedin,
    username,
    following,
  });
  res.end();
}

async function renderLoginPage(req, res) {
  console.log('renderLoginPage called');
  res.render('pages/login');
}

async function renderSignupPage(req, res) {
  console.log('renderSignupPage called');
  res.render('pages/signup');
}

function updateSessionUserData(request, username, userId) {
  console.log('User session, userid:', userId);
  request.session.loggedin = true;
  request.session.username = username;
  request.session.userid = userId;
}

async function attemptLoginUser(request, username, password) {
  console.log('attemtLoginUser called');
  if (username && password) {
    const userIdRow = await userRepository.getIdUsingPassword(username, password);

    if (userIdRow) {
      updateSessionUserData(request, username, userIdRow.id);
      return userIdRow;
    }
  }

  return null;
}


async function loginButton(req, res) {
  console.log('loginButton called');
  const { username, password } = req.body;

  if (!(username && password)) {
    res.render('pages/login', {
      error: 'Please enter username and password',
    });
    res.end();
  }

  const isUserLoggedIn = await attemptLoginUser(req, username, password);
  if (isUserLoggedIn) {
    res.redirect('/home');
    res.end();
  } else {
    res.render('pages/login', {
      error: 'Incorrect username or password.',
    });
    res.end();
  }
}

function logoutButton(req, res) {
  console.log(`logoutButton called: ${req.session.username}`);
  req.session.destroy();
  res.redirect('/public');
}

async function signupButton(req, res) {
  const { username, email, password } = req.body;

  if (!(username && password && email)) {
    res.render('pages/signup', {
      error: 'Please enter username, email and password',
    });
    res.end();
    return;
  }

  console.log('- Creating new user -');
  console.log(`user: ${username}`);
  console.log(`email: ${username}`);
  console.log(`pass: ${password}`);

  const existingUser = await userRepository.getUserID(username);

  if (existingUser) {
    res.render('pages/signup', {
      error: 'Username is invalid.',
    });
    res.end();
  }

  const isUserAdded = await userRepository.addUser(username, password, email);
  if (!isUserAdded) {
    res.render('pages/signup', {
      error: 'Adding user to database failed.',
    });
    res.end();
  }

  const isUserLoggedIn = await attemptLoginUser(req, username, password);
  if (isUserLoggedIn) {
    res.redirect('/home');
  } else {
    res.render('pages/signup', {
      error: 'Sign up failed',
    });
  }
  res.end();
}

// TODO Needs to be implemented in UI. Put it in backlog
async function followButton(req, res) {
  console.log('followButton called');

  if (!req.session.loggedin) {
    res.status(401).send({ url: `${req.originalUrl} : unautorized - user not followed.` });
  }
  const followerID = req.session.userid;

  const followedUsername = req.params.username;
  const followedID = await userRepository.getUserID(followedUsername);
  if (followedID == null) {
    res.status(404).send({ url: `${req.originalUrl} : was not found.` }); // Render page?
  }
  console.log(`id: ${followerID}now follows id: ${followedID.id}`);
  await userRepository.follow(followerID, followedID.id);

  res.back();
}

async function unfollowButton(req, res) {
  console.log('unfollowButton called');

  if (!req.session.loggedin) {
    res.status(401).send({ url: `${req.originalUrl} : unautorized - user not unfollowed.` });
  }
  const followerID = req.session.userid;

  const followedUsername = req.params.username;
  const followedID = await userRepository.getUserID(followedUsername);
  if (followedID == null) {
    res.status(404).send({ url: `${req.originalUrl} : was not found.` }); // Render page?
  }
  console.log(`id: ${followerID}no longer follows id: ${followedID.id}`);
  await userRepository.unfollow(followerID, followedID.id);

  res.back();
}


module.exports = {
  router,
  mainView,
  renderPublicTimeLine,
  renderPrivateTimeline,
  renderUserTimeline,
  renderLoginPage,
  renderSignupPage,
  loginButton,
  logoutButton,
  signupButton,
  postMessage,
  followButton,
  unfollowButton,
};
