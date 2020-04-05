const Sequelize = require('sequelize');
const config = require('../../configs');
const logger = require('../../logging/logging');

let sequelize = null;

if (config.database.protocol === 'sqlite') {
	sequelize = new Sequelize({
		dialect: 'sqlite',
		logging: false,
		storage: config.database.path,
	});
} else {
	sequelize = new Sequelize(config.database.url, {
		dialect: config.database.protocol,
		logging: false,
	});
}

// Create tables if they do not already exist
sequelize.sync();

sequelize.authenticate().then(() => {
	logger.info('Connection to sequelize has been established succesfully.');
}).catch((err) => {
	logger.info('Unable to connect to the database.');
	logger.info(err);
});

const User = sequelize.define('user', {
	// attributes
	username: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
	},
}, {
	// options
});

const Message = sequelize.define('message', {
	// attributes
	text: {
		type: Sequelize.STRING,
		allowNull: false,
	},
}, {
	// options
});

const Follower = sequelize.define('follower', {
	// attributes
	followerId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	followedId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
}, {
	// options
});

// associations
User.belongsToMany(User, {
	as: 'following',
	through: Follower,
	foreignKey: 'followerId',
});
User.belongsToMany(User, {
	as: 'followers',
	through: Follower,
	foreignKey: 'followedId',
});
User.hasMany(Message, { foreignKey: 'userId' });
Follower.belongsTo(User, { as: 'fllwed', foreignKey: 'followedId' });
Follower.belongsTo(User, { as: 'fllwer', foreignKey: 'followerId' });
Message.belongsTo(User);

// Apply changes to db (MIGHT DELETE ENTRIES)
// User.sync({ force: true });
// Message.sync({ force: true });
// Follower.sync({ force: true });

// Delete everything
// User.destroy({
//     where: {},
//     truncate: true
//   })

// It will wipe the database upon each startup
// sequelize.sync({ force: true });

module.exports = {
	User,
	Message,
	Follower,
};
