const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Forum extends Model {
        static associate(models) {
            Forum.belongsTo(models.Theme, { foreignKey: 'themeId' });
        }
    }

    Forum.init({
        title: DataTypes.STRING,
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Forum'
    });

    return Forum;
};
