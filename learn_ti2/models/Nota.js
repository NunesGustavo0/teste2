const db = require('./conexaoBD/conector');

// models/Nota.js
const Nota = db.sequelize.define('nota', {
  notcodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bocodigo: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'boletim',
      key: 'bocodigo'
    }
  },
  notavalor: {
    type: db.Sequelize.DECIMAL(4, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  notadesc: {
    type: db.Sequelize.STRING(75),
    allowNull: true
  },
  data_avaliacao: {
    type: db.Sequelize.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});
module.exports = Nota;
