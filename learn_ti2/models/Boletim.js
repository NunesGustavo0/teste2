// models/Boletim.js
const db = require('./conexaoBD/conector');

const Boletim = db.sequelize.define('boletim', {
  bocodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usucodigo: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'usucodigo'
    }
  },
  disccodigo: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'disciplina',
      key: 'disccodigo'
    }
  },
  bonome: {
    type: db.Sequelize.STRING(75),
    allowNull: false,
    validate: {
      len: [2, 75]
    }
  },
  boano: { // NOVA COLUNA
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  bosemestre: { // NOVA COLUNA
    type: db.Sequelize.TINYINT(1),
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'boletim', // Adicionado para consistência
  freezeTableName: true, // Adicionado para consistência
  indexes: [
    {
      unique: true,
      fields: ['usucodigo', 'disccodigo', 'boano', 'bosemestre'] // UNIQUE KEY ATUALIZADA
    }
  ]
});
module.exports = Boletim;