// models/Disciplina.js
const db = require('./conexaoBD/conector');

const Disciplina = db.sequelize.define('disciplina', {
  disccodigo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discnome: {
    type: db.Sequelize.STRING(75),
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 75]
    }
  },
  discdesc: {
    type: db.Sequelize.STRING(255),
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  slug: { // <-- NOVO CAMPO: SLUG
    type: db.Sequelize.STRING(100),
    allowNull: false, // Agora é NOT NULL no banco
    unique: true,     // Agora é UNIQUE no banco
    validate: {
      len: [2, 100]
    }
  }
}, {
  timestamps: false,
  tableName: 'disciplina',
  freezeTableName: true
});

module.exports = Disciplina;