const db = require('./conexaoBD/conector');

// models/Usuario.js
const Usuario = db.sequelize.define('usuario', {
  usucodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usunome: {
    type: db.Sequelize.STRING(75),
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 75]
    }
  },
  usuemail: {
    type: db.Sequelize.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  usutelefone: {
    type: db.Sequelize.STRING(20),
    allowNull: true
  },
  ususenha: {
    type: db.Sequelize.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  }
}, {
  timestamps: false,
  tableName: 'usuario'
});

module.exports = Usuario;
