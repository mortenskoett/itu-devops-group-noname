const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: './server/persistence/sqlite/minitwit.db'
});

sequelize.authenticate().then(() => {
    console.log('Connection to sequelize has been established succesfully.');
}).catch(err => {
    console.error('Unable to connect to the database.');
    console.error(err);
});

const User = sequelize.define('user', {
    //attributes
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    //options
});

const Message = sequelize.define('message', {
    //attributes
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    //options
});
    
const Follower = sequelize.define('follower', {
    //attributes
    followerId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    followedId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    //options
});

//associations
User.belongsToMany(User, {
    as: 'following',
    through: Follower,
    foreignKey: 'followerId'
});
User.belongsToMany(User, {
    as: 'followers',
    through: Follower,
    foreignKey: 'followedId'
});
User.hasMany(Message, { foreignKey: 'userId'});
Follower.belongsTo(User, { as: 'fllwed', foreignKey: 'followedId' });
Follower.belongsTo(User, { as: 'fllwer', foreignKey: 'followerId' });
Message.belongsTo(User);

//Apply changes to db (MIGHT DELETE ENTRIES)
// User.sync({ force: true });
// Message.sync({ force: true });
// Follower.sync({ force: true });

//Delete everything
// User.destroy({
//     where: {},
//     truncate: true
//   })

module.exports = {
    User,
    Message,
    Follower
}