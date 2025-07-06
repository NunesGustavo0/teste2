const db = require('./conexaoBD/conector');

// models/Questao.js
const Questao = db.sequelize.define('questao', {
  questcodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quizcodigo: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'quiz',
      key: 'quizcodigo'
    }
  },
  questpergunta: {
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  questdificuldade: {
    type: db.Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isIn: [[1, 2, 3]]
    }
  },
  ordem: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  pontuacao: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false
});
module.exports = Questao;
