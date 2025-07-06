const db = require('./conexaoBD/conector');

// models/Flashcard.js
const Flashcard = db.sequelize.define('flashcard', {
  fccodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  disccodigo: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'disciplina',
      key: 'disccodigo'
    }
  },
  fcfrente: {
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  fcverso: {
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  dificuldade: {
    type: db.Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
module.exports = Flashcard;
