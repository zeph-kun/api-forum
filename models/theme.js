const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class Theme extends Model {
        static associate(models) {
            Theme.hasMany(models.Forums, { foreignKey: 'themeId' });
        }
    }

    Theme.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Theme'
    });

    return Theme;
};