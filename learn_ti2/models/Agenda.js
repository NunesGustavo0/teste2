const db = require('./conexaoBD/conector');

// models/Agenda.js
const Agenda = db.sequelize.define('agenda', {
  agcodigo: {
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
  agtarefanome: {
    type: db.Sequelize.STRING(75),
    allowNull: false,
    validate: {
      len: [2, 75]
    }
  },
  agtarefadesc: {
    type: db.Sequelize.TEXT,
    allowNull: true
  },
  agtarefastatus: {
    type: db.Sequelize.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  agtarefadata: {
    type: db.Sequelize.DATE,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'agenda', // <--- ADICIONE ESTA LINHA: força o nome da tabela como 'agenda'
  freezeTableName: true
});
module.exports = Agenda;
