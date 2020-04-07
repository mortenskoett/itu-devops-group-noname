
/**
    Endpoints for simulator
*/
const timeUtil = require('../utilities/timeDateUtil');
const db = require('../persistence/models/models');
const logger = require('../logging/logging');

let LATEST = 0; // Latest recieved 'latest' value

function updateLatest(req) {
	const { latest } = req.query;
	if (latest) {
		let latestAsNumber = parseInt(latest, 10);
		if (latestAsNumber) LATEST = latestAsNumber;
	}
}

async function validate(username, pwd, email) {
	if (!username) return 'You have to enter a username';
	if (!email /* && !contains @ */) return 'You have to enter a valid email address';
	if (!pwd) return 'You have to enter a password';
	const user = await db.User.findOne({ where: { username } });
	if (user) return 'Username already exists.';
	return null;
}

// Get latest value (stored for each api request)
// @app.route("/latest", methods=["GET"])
async function getLatest(req, res) {
	logger.info('/latest 200');
	res.status(200).send({ latest: LATEST });
}

// @app.route("/register", methods=["POST"])
async function register(req, res) {
	updateLatest(req);

	const { username, email, pwd } = req.body;

	const err = await validate(username, pwd, email);
	if (err) {
		logger.info('/register 400');
		res.status(400).send({ error_msg: err });
		return;
	}

	const isUserAdded = await db.User.create({ username, password: pwd, email });
	if (!isUserAdded) {
		logger.info('/register 500');
		res.status(500).send({ error_msg: 'Adding user to database failed.' });
		return;
	}

	logger.info('/register 204');
	res.status(204).send();
}

// @app.route("/msgs", methods=["GET"])
async function getMessages(req, res) {
	updateLatest(req);

	const noMessages = req.query.no ? req.query.no : 100;

	const allMessages = await db.Message.findAll({
		limit: noMessages,
		order: [['createdAt', 'DESC']],
		include: [db.User],
		// where: { flagged: false }
	});

	const jsonMessages = allMessages.map((m) => ({
		content: m.text,
		pub_date: m.createdAt,
		user: m.user.username,
	}));

	logger.info('/msgs 200');
	res.status(200).send(jsonMessages);
}

// @app.route("/msgs/<username>", methods=["GET", "POST"])
async function getUserMessages(req, res) {
	updateLatest(req);

	const noMessages = req.query.no ? req.query.no : 100;

	const user = await db.User.findOne({ where: { username: req.params.username } });
	if (!user) {
		logger.info('/msgs/<username> GET 404');
		res.status(404).send({ error_msg: 'User id not found.' });
		return;
	}

	const messages = await user.getMessages({
		limit: noMessages,
		order: [['createdAt', 'DESC']],
		include: [db.User],
		// where: { flagged: false }
	});

	const jsonMessages = messages.map((m) => ({
		content: m.text,
		pub_date: m.createdAt,
		user: m.user.username,
	}));

	logger.info('/msgs/<username> GET 200');
	res.status(200).send(jsonMessages);
}

async function postMessage(req, res) {
	updateLatest(req);
	const { username } = req.params;
	const date = timeUtil.getFormattedDate();

	const user = await db.User.findOne({ where: { username } });
	if (!user) {
		logger.info('/msgs/username POST 404');
		res.status(404).send({ error_msg: `Error finding user "${username}"` });
		return;
	}
	await user.createMessage({ text: req.body.content, date });

	logger.info('/msgs/username POST 204');
	res.status(204).send();
}

// @app.route("/fllws/<username>", methods=["GET", "POST"])
async function getFollows(req, res) {
	updateLatest(req);

	const { username } = req.params;
	const noMessages = req.query.no ? req.query.no : 100;

	const user = await db.User.findOne({ where: { username } });
	if (!user) {
		res.status(404).send({ error_msg: `Error finding user "${username}"` });
		return;
	}

	const follows = await user.getFollowers({ limit: noMessages });

	const jsonFollows = follows.map((e) => e.dataValues.username);

	logger.error('/fllws/username GET 200');
	res.status(200).send({ follows: jsonFollows });
}

async function setFollow(req, res) {
	updateLatest(req);

	const { follow, unfollow } = req.body;
	if (!(follow || unfollow)) {
		res.sendStatus(400);
	}

	const { username } = req.params;

	const user = await db.User.findOne({ where: { username } });
	if (!user) {
		logger.error('/fllws/username POST 400');
		res.status(400).send({ error_msg: `Error finding user "${username}"` });
		return;
	}

	if (follow) {
		const otherUser = await db.User.findOne({ where: { username: follow } });
		if (!otherUser) {
			logger.error('/fllws/username POST 400');
			res.status(400).send({ error_msg: `Error finding user "${username}"` });
			return;
		}
		await user.addFollower(otherUser);
	} else if (unfollow) {
		const otherUser = await db.User.findOne({ where: { username: unfollow } });
		if (!otherUser) {
			logger.error('/fllws/username POST 400');
			res.status(400).send({ error_msg: `Error finding user "${username}"` });
			return;
		}

		await user.removeFollowers(otherUser);
	}
	logger.error('/fllws/username POST 204');
	res.sendStatus(204);
}

module.exports = {
	getLatest,
	register,
	getMessages,
	getUserMessages,
	postMessage,
	getFollows,
	setFollow,
};
