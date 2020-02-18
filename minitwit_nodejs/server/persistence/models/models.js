const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './server/persistence/sqlite/minitwit.db'
});

sequelize.authenticate().then(() => {
    console.log('Connection to sequelize has been established succesfully.');
}).catch(err => {
    console.error('Unable to connect to the database.');
    console.error(err);
});


const User = sequelize.define('user', {
    //atributes
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

//User.belongsToMany(User, {through: 'followerId', foreignKey: 'followedId'})

const Message = sequelize.define('message', {
    //atributes
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    //options
});

Message.belongsTo(User); // Will also add userId to Message model

//Message.sync({force: true});

/**
 * Returns the user model.
 */
function getUserModel() {
    return User;
};

/**
 * Returns the message model.
 */
function getMessageModel() {
    return Message;
};

/**
 * Returns sequelize db ref.
 */
function getSequelize() {
    return sequelize;
};


module.exports = {
    getUserModel,
    getMessageModel,
    getSequelize
}