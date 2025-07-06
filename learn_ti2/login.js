const express = require("express");
const app = express();
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const Disciplina = require('./models/Disciplinas');
const Usuario = require('./models/Usuario');
const Agenda = require('./models/Agenda');
const Flashcard = require('./models/Flashcard');
const db = require('./models/conexaoBD/conector');

// --- Configuração de Sessão ---
app.use(session({
    secret: 'sua-chave-secreta-aqui', // Mude para uma chave segura e complexa!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Defina como 'true' em produção com HTTPS
}));

// --- Configuração de Arquivos Estáticos ---
// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Configuração do Handlebars ---
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        ifEq: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        formatDate: function(date) { // Helper para formatar a data no frontend
            if (!date) return '';
            const d = new Date(date);
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return d.toLocaleDateString('pt-BR', options);
        },
        formatTime: function(date) { // Helper para formatar a hora no frontend
            if (!date) return '';
            const d = new Date(date);
            const options = { hour: '2-digit', minute: '2-digit' };
            return d.toLocaleTimeString('pt-BR', options);
        }
    }
}));

// --- Configuração do Body-parser ---
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// --- Middleware para Notificações ---
// Este middleware limpa notificações da sessão e as passa para o template
app.use((req, res, next) => {
    res.locals.notification = req.session.notification;
    req.session.notification = null; // Limpa a notificação após ser lida
    next();
});

function isAuthenticated(req, res, next) {
    if (req.session.loggedin) {
        return next();
    }
    req.session.notification = { type: 'error', title: 'Acesso negado', message: 'Você precisa fazer login para acessar esta página!' };
    res.redirect('/');
}

// --- Rotas ---

// Rota principal (Login)
app.get('/', function(req, res) {
    res.render('index', { notification: res.locals.notification });
});

// Rota de Cadastro
app.get('/cad', function(req, res) {
    res.render('cadastro', { notification: res.locals.notification });
});

// Rota de Login (POST)
app.post('/login', async function(req, res) {
    const { usuario, senha } = req.body;

    // Validação de entrada
    if (!usuario || !senha) {
        req.session.notification = { type: 'error', title: 'Campos obrigatórios', message: 'Por favor, preencha usuário e senha!' };
        return res.redirect('/');
    }
    if (usuario.length < 2 || senha.length < 6) {
        req.session.notification = { type: 'error', title: 'Dados inválidos', message: 'Usuário deve ter pelo menos 2 caracteres e senha pelo menos 6 caracteres!' };
        return res.redirect('/');
    }

    try {
        const user = await Usuario.findOne({ where: { usunome: usuario } });

        if (!user) {
            req.session.notification = { type: 'error', title: 'Usuário não encontrado', message: 'Este usuário não está cadastrado em nosso sistema!' };
            return res.redirect('/');
        }

        // Simulação de verificação de senha (em um cenário real, você usaria hash)
        if (user.ususenha !== senha) {
            req.session.notification = { type: 'error', title: 'Senha incorreta', message: 'A senha informada está incorreta!' };
            return res.redirect('/');
        }

        // Login bem-sucedido
        req.session.loggedin = true;
        req.session.username = usuario;
        req.session.userId = user.usucodigo;

        req.session.notification = { type: 'success', title: 'Login realizado!', message: `Bem-vindo, ${usuario}!` };
        res.redirect('/home');

    } catch (error) {
        console.error('Erro no login:', error);
        req.session.notification = { type: 'error', title: 'Erro interno', message: 'Ocorreu um erro interno. Tente novamente em alguns minutos.' };
        res.redirect('/');
    }
});

// Rota para Cadastro (POST)
app.post('/cadastro', async function(req, res) {
    const { usuario, email, senha } = req.body;

    // Validação de entrada
    if (!usuario || !email || !senha) {
        req.session.notification = { type: 'error', title: 'Campos obrigatórios', message: 'Todos os campos são obrigatórios!' };
        return res.redirect('/cad');
    }
    if (usuario.length < 2) {
        req.session.notification = { type: 'error', title: 'Usuário inválido', message: 'O nome de usuário deve ter pelo menos 2 caracteres!' };
        return res.redirect('/cad');
    }
    if (senha.length < 6) {
        req.session.notification = { type: 'error', title: 'Senha inválida', message: 'A senha deve ter pelo menos 6 caracteres!' };
        return res.redirect('/cad');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        req.session.notification = { type: 'error', title: 'Email inválido', message: 'Por favor, insira um email válido!' };
        return res.redirect('/cad');
    }

    try {
        const existingUser = await Usuario.findOne({ where: { usunome: usuario } });
        if (existingUser) {
            req.session.notification = { type: 'error', title: 'Usuário já existe', message: 'Este nome de usuário já está em uso!' };
            return res.redirect('/cad');
        }

        const existingEmail = await Usuario.findOne({ where: { usuemail: email } });
        if (existingEmail) {
            req.session.notification = { type: 'error', title: 'Email já cadastrado', message: 'Este email já está cadastrado!' };
            return res.redirect('/cad');
        }

        // Criar novo usuário
        await Usuario.create({
            usunome: usuario,
            usuemail: email,
            ususenha: senha,
            usucpf: null, // Campos opcionais, podem ser adicionados depois
            usutelefone: null
        });

        req.session.notification = { type: 'success', title: 'Cadastro realizado!', message: 'Conta criada com sucesso! Faça login para continuar.' };
        res.redirect('/');

    } catch (error) {
        console.error('Erro no cadastro:', error);
        req.session.notification = { type: 'error', title: 'Erro interno', message: 'Ocorreu um erro ao criar a conta. Tente novamente.' };
        res.redirect('/cad');
    }
});

// Rota Home (Protegida)
app.get('/home', function(req, res) {
    if (req.session.loggedin) {
        res.render('home', {
            username: req.session.username,
            notification: res.locals.notification
        });
    } else {
        req.session.notification = { type: 'error', title: 'Acesso negado', message: 'Você precisa fazer login para acessar esta página!' };
        res.redirect('/');
    }
});

// Rota de Logout
app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.error('Erro ao fazer logout:', err);
        }
        res.redirect('/');
    });
});
// ... (código existente em login.js) ...


// Rota da Agenda (Protegida)
app.get('/agenda', isAuthenticated, function(req, res) {
    res.render('agenda', {
        username: req.session.username,
        notification: res.locals.notification,
        currentPath: req.path
    });
});

// --- Rotas de API para a Agenda (Protegidas) ---

// POST /api/tasks: Adicionar uma nova tarefa
app.post('/api/tasks', isAuthenticated, async (req, res) => {
    const { taskTime, taskTitle, taskDiscipline, taskDate } = req.body;
    const usucodigo = req.session.userId; // Obter o usucodigo da sessão

    if (!usucodigo || !taskTime || !taskTitle || !taskDiscipline || !taskDate) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios para adicionar uma tarefa.' });
    }

    try {
        // Combinar data e hora para agtarefadata
        const dateTime = new Date(`${taskDate}T${taskTime}:00`);

        const newTask = await Agenda.create({
            usucodigo: usucodigo,
            agtarefanome: taskTitle,
            agtarefadesc: taskDiscipline, // Usando disciplina como descrição por enquanto
            agtarefastatus: 0, // Padrão para não concluída
            agtarefadata: dateTime
        });
        res.status(201).json({ message: 'Tarefa adicionada com sucesso!', task: newTask });
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        res.status(500).json({ message: 'Erro interno ao adicionar tarefa.' });
    }
});

// GET /api/tasks: Listar tarefas do usuário (opcionalmente por data)
app.get('/api/tasks', isAuthenticated, async (req, res) => {
    const usucodigo = req.session.userId;
    const { date } = req.query; // Recebe a data como query parameter (YYYY-MM-DD)

    if (!usucodigo) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    try {
        let whereClause = { usucodigo: usucodigo };

        if (date) {
            const parts = date.split('-');
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Mês é baseado em 0 (janeiro = 0)
            const day = parseInt(parts[2]);

            // Crie objetos Date que representam o início e o fim do dia
            // NO FUSO HORÁRIO LOCAL DO SERVIDOR.
            // O construtor Date(ano, mês, dia, hora, minuto, segundo, milissegundo)
            // interpreta os argumentos no fuso horário local.
            const startDate = new Date(year, month, day, 0, 0, 0, 0);
            const endDate = new Date(year, month, day, 23, 59, 59, 999);

            whereClause.agtarefadata = {
                [db.Sequelize.Op.between]: [startDate, endDate]
            };
        }

        const tasks = await Agenda.findAll({
            where: whereClause,
            order: [['agtarefadata', 'ASC']]
        });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ message: 'Erro interno ao buscar tarefas.' });
    }
});

// DELETE /api/tasks/:id: Excluir uma tarefa
app.delete('/api/tasks/:id', isAuthenticated, async (req, res) => {
    const agcodigo = req.params.id;
    const usucodigo = req.session.userId;

    if (!usucodigo) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    try {
        const task = await Agenda.findOne({
            where: { agcodigo: agcodigo, usucodigo: usucodigo }
        });

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence a este usuário.' });
        }

        await task.destroy();
        res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        res.status(500).json({ message: 'Erro interno ao excluir tarefa.' });
    }
});

// Rota da Página de Listagem de Disciplinas (Agora busca do DB)
app.get('/disciplinas', isAuthenticated, async function(req, res) {
    try {
        const allDisciplines = await Disciplina.findAll({
            order: [['discnome', 'ASC']] // Ordena por nome
        });
        res.render('disciplinas', {
            currentPath: req.path,
            username: req.session.username,
            notification: res.locals.notification,
            disciplines: allDisciplines.map(d => d.toJSON()) // Converte para JSON puro
        });
    } catch (error) {
        console.error('Erro ao listar disciplinas:', error);
        req.session.notification = { type: 'error', title: 'Erro', message: 'Não foi possível carregar as disciplinas.' };
        res.redirect('/home'); // Redireciona para home em caso de erro
    }
});

// Rota Dinâmica para Páginas de Detalhe de Disciplina (com base no slug)
app.get('/disciplinas/:slug', isAuthenticated, async (req, res) => {
    const disciplineSlug = req.params.slug; // Captura o slug da URL

    try {
        const discipline = await Disciplina.findOne({
            where: { slug: disciplineSlug }
        });

        if (!discipline) {
            // Se a disciplina não for encontrada, redireciona ou mostra erro
            req.session.notification = { type: 'error', title: 'Disciplina não encontrada', message: `A disciplina "${disciplineSlug}" não foi encontrada.` };
            return res.redirect('/disciplinas'); // Volta para a lista de disciplinas
        }

        // Renderiza o template genérico 'disciplinePage.handlebars'
        // e passa os dados da disciplina para ele.
        res.render('disciplinePage', {
            username: req.session.username,
            notification: res.locals.notification,
            currentPath: req.path, // Para o helper de navegação ativa
            discipline: discipline.toJSON() // Passa todos os dados da disciplina para o frontend
        });

    } catch (error) {
        console.error(`Erro ao carregar página da disciplina ${disciplineSlug}:`, error);
        req.session.notification = { type: 'error', title: 'Erro interno', message: 'Ocorreu um erro ao carregar a página da disciplina.' };
        res.redirect('/disciplinas');
    }
});

// Rota para a página de Flashcards de uma disciplina específica
app.get('/flashcards/:slug', isAuthenticated, async (req, res) => {
    const disciplineSlug = req.params.slug;

    try {
        const discipline = await Disciplina.findOne({
            where: { slug: disciplineSlug }
        });

        if (!discipline) {
            req.session.notification = { type: 'error', title: 'Disciplina não encontrada', message: `A disciplina "${disciplineSlug}" não foi encontrada para os flashcards.` };
            return res.redirect('/disciplinas');
        }

        // Não vamos buscar os flashcards aqui diretamente.
        // O JavaScript do front-end fará uma requisição AJAX separada para os flashcards.
        res.render('flashcards', {
            username: req.session.username,
            notification: res.locals.notification,
            currentPath: req.path,
            discipline: discipline.toJSON() // Passa os dados da disciplina
        });

    } catch (error) {
        console.error(`Erro ao carregar página de flashcards para ${disciplineSlug}:`, error);
        req.session.notification = { type: 'error', title: 'Erro interno', message: 'Ocorreu um erro ao carregar a página de flashcards.' };
        res.redirect('/disciplinas');
    }
});

// POST /api/flashcards: Adicionar um novo flashcard para uma disciplina
app.post('/api/flashcards', isAuthenticated, async (req, res) => {
    const { discCodigo, fcFrente, fcVerso } = req.body; // Use discCodigo (ID da disciplina)
    const usucodigo = req.session.userId; // Pode ser útil para auditoria ou se flashcards forem por usuário

    if (!discCodigo || !fcFrente || !fcVerso) {
        return res.status(400).json({ message: 'Todos os campos (disciplina, frente, verso) são obrigatórios.' });
    }

    try {
        const discipline = await Disciplina.findByPk(discCodigo);
        if (!discipline) {
            return res.status(404).json({ message: 'Disciplina não encontrada.' });
        }

        const newFlashcard = await Flashcard.create({
            disccodigo: discCodigo,
            fcfrente: fcFrente,
            fcverso: fcVerso,
            dificuldade: 1 // Default
        });
        res.status(201).json({ message: 'Flashcard adicionado com sucesso!', flashcard: newFlashcard.toJSON() });
    } catch (error) {
        console.error('Erro ao adicionar flashcard:', error);
        res.status(500).json({ message: 'Erro interno ao adicionar flashcard.' });
    }
});

// GET /api/flashcards/:discCodigo: Listar flashcards de uma disciplina
app.get('/api/flashcards/:discCodigo', isAuthenticated, async (req, res) => {
    const discCodigo = req.params.discCodigo;

    try {
        const flashcards = await Flashcard.findAll({
            where: { disccodigo: discCodigo },
            order: [['fccodigo', 'ASC']] // Ou outra ordem
        });
        res.status(200).json(flashcards.map(fc => fc.toJSON()));
    } catch (error) {
        console.error('Erro ao buscar flashcards:', error);
        res.status(500).json({ message: 'Erro interno ao buscar flashcards.' });
    }
});

// PUT /api/flashcards/:id: Atualizar um flashcard
app.put('/api/flashcards/:id', isAuthenticated, async (req, res) => {
    const fccodigo = req.params.id;
    const { fcFrente, fcVerso, dificuldade } = req.body;

    try {
        const flashcard = await Flashcard.findByPk(fccodigo);

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard não encontrado.' });
        }

        // Valide se o usuário logado tem permissão para editar (se necessário)
        // Por enquanto, qualquer um logado pode editar qualquer flashcard.
        // Se Flashcard pertencer a um Usuário, adicione uma verificação aqui.

        flashcard.fcfrente = fcFrente || flashcard.fcfrente;
        flashcard.fcverso = fcVerso || flashcard.fcverso;
        flashcard.dificuldade = dificuldade || flashcard.dificuldade;

        await flashcard.save();
        res.status(200).json({ message: 'Flashcard atualizado com sucesso!', flashcard: flashcard.toJSON() });
    } catch (error) {
        console.error('Erro ao atualizar flashcard:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar flashcard.' });
    }
});

// DELETE /api/flashcards/:id: Excluir um flashcard
app.delete('/api/flashcards/:id', isAuthenticated, async (req, res) => {
    const fccodigo = req.params.id;

    try {
        const flashcard = await Flashcard.findByPk(fccodigo);

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard não encontrado.' });
        }

        // Valide se o usuário logado tem permissão para excluir (se necessário)

        await flashcard.destroy();
        res.status(200).json({ message: 'Flashcard excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir flashcard:', error);
        res.status(500).json({ message: 'Erro interno ao excluir flashcard.' });
    }
});

// --- Inicialização do Servidor ---
const PORT = 8081;
app.listen(PORT, function() {
    console.log(`Servidor rodando na url http://localhost:${PORT}`);
});