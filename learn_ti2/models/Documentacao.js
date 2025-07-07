const db = require('./conexaoBD/conector');

// models/Documentacao.js
const Documentacao = db.sequelize.define('documentacao', {
  doccodigo: {
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
  doctitulo: {
    type: db.Sequelize.STRING(75),
    allowNull: false,
    validate: {
      len: [2, 75]
    }
  },
  docdesc: {
    type: db.Sequelize.TEXT,
    allowNull: true
  },
  doclink: {
    type: db.Sequelize.STRING(2048),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  tipo_documento: {
    type: db.Sequelize.STRING(50),
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'documentacao'
});
module.exports = Documentacao;
