const db = require('./conexaoBD/conector');

// models/Quiz.js
const db = require('./db');
const Quiz = db.sequelize.define('quiz', {
  quizcodigo: {
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
  quiztitulo: {
    type: db.Sequelize.STRING(75),
    allowNull: false,
    validate: {
      len: [2, 75]
    }
  },
  quizdesc: {
    type: db.Sequelize.TEXT,
    allowNull: true
  },
  tempo_limite: {
    type: db.Sequelize.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
module.exports = Quiz;
