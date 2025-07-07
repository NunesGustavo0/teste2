const db = require('./conexaoBD/conector');

// models/Cadastro.js
const Cadastro = db.sequelize.define('cadastro', {
  usucodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuario',
      key: 'usucodigo'
    }
  },
  disccodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: 'disciplina',
      key: 'disccodigo'
    }
  },
  data_cadastro: {
    type: db.Sequelize.DATE,
    allowNull: false,
    defaultValue: db.Sequelize.NOW
  },
  status: {
    type: db.Sequelize.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false
});
module.exports = Cadastro;
