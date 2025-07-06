const { Sequelize, DataTypes } = require('sequelize');

//Conexao com o banco dados
const sequelize = new Sequelize('learn_ti', 'root', '#A30des42', {
    host: "localhost",
    dialect: "mysql",
    timezone: '-04:00',
    dialectOptions: {
        useUTC: false,
        dateStrings: true,
        typeCast: true
    }
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    DataTypes: DataTypes
}