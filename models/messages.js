const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.Forums, { foreignKey: 'forumId' });
            Message.belongsTo(models.User, { foreignKey: 'userId' });
            Message.hasMany(models.Messages, { as: 'Replies', foreignKey: 'replyToMessageId' });
        }
    }
    Message.init({
    id: {
        type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
    },
    subject: {
        type: DataTypes.STRING,
            allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
            allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    replyToMessageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Messages',
            key: 'id'
        }
    },
    forumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Forums',
            key: 'id'
        }
    }
}, {
        sequelize,
            modelName: 'Messages'
    });
    return Message;
};