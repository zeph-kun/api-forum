const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Forum extends Model {
        static associate(models) {
            Forum.belongsTo(models.Theme, { foreignKey: 'themeId' });
            Forum.hasMany(models.Messages, { foreignKey: 'forumId' });
        }
    }

    Forum.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        themeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Themes',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Forums'
    });

    return Forum;
};
