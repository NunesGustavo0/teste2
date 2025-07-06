const db = require('./conexaoBD/conector');

// models/Resposta.js
const Resposta = db.sequelize.define('resposta', {
  respcodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questcodigo: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'questao',
      key: 'questcodigo'
    }
  },
  respnome: {
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  respveri: {
    type: db.Sequelize.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  ordem: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false
});
module.exports = Resposta;