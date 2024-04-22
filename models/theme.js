const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class Theme extends Model {
        static associate(models) {
            Theme.hasMany(models.Forum, { foreignKey: 'themeId' });
        }
    }

    Theme.init({
        name: DataTypes.STRING,
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Theme'
    });

    return Theme;
};