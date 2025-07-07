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
  bonome: { // Este campo é o nome da disciplina no boletim
    type: db.Sequelize.STRING(75),
    allowNull: false,
    validate: {
      len: [2, 75]
    }
  },
  boano: { // Ano do semestre
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  bosemestre: { // Semestre (1 ou 2)
    type: db.Sequelize.TINYINT(1),
    allowNull: false
  },
  // --- NOVAS COLUNAS PARA AS NOTAS ---
  n1: {
    type: db.Sequelize.DECIMAL(4, 2), // Exemplo: 99.99 (duas casas decimais)
    allowNull: true, // Permitir que a nota seja nula se ainda não lançada
    defaultValue: null // Valor padrão
  },
  n2: {
    type: db.Sequelize.DECIMAL(4, 2),
    allowNull: true,
    defaultValue: null
  },
  n3: {
    type: db.Sequelize.DECIMAL(4, 2),
    allowNull: true,
    defaultValue: null
  }
  // --- FIM DAS NOVAS COLUNAS ---
}, {
  timestamps: false,
  tableName: 'boletim',
  freezeTableName: true,
  indexes: [
    {
      unique: true,
      fields: ['usucodigo', 'disccodigo', 'boano', 'bosemestre']
    }
  ]
});
module.exports = Boletim;