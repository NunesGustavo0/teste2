// learn_ti2/models/Flashcard.js
const db = require('./conexaoBD/conector'); // Garanta que o caminho está correto

const Flashcard = db.sequelize.define('flashcard', {
  fccodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  disccodigo: { // ID da disciplina a que este flashcard pertence
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'disciplina', // Nome da tabela Disciplina
      key: 'disccodigo'
    }
  },
  fcfrente: { // Conteúdo da frente do flashcard (pergunta)
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  fcverso: { // Conteúdo do verso do flashcard (resposta)
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  dificuldade: { // Nível de dificuldade (ex: 1=fácil, 2=médio, 3=difícil)
    type: db.Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 1
  }
}, {
  timestamps: false, // Se não usa created_at/updated_at
  tableName: 'flashcard', // Nome exato da tabela no banco de dados
  freezeTableName: true
});

module.exports = Flashcard;