// public/js/agenda.js

let currentMonth = new Date();
let selectedDate = new Date(); // Inicia com a data atual selecionada

// Variáveis para os elementos HTML, declaradas aqui para serem acessíveis em todo o módulo
let tasksList;
let noTasksMessage;

document.addEventListener('DOMContentLoaded', function() {
    // Obtenha as referências aos elementos HTML AQUI,
    // garantindo que eles já estejam disponíveis no DOM após o carregamento da página.
    tasksList = document.getElementById('tasksList');
    noTasksMessage = document.getElementById('noTasksMessage');

    renderCalendar();
    updateCurrentDateDisplay();
    fetchTasksForSelectedDate(); // Carrega tarefas ao carregar a página

    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addTask();
        });
    }

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const taskIdToDelete = confirmDeleteBtn.dataset.taskId;
            if (taskIdToDelete) {
                deleteTaskConfirmed(taskIdToDelete);
            }
            closeConfirmModal();
        });
    }
});

function updateCurrentDateDisplay() {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    document.getElementById('currentDate').textContent = selectedDate.toLocaleDateString('pt-BR', options);
}

function renderCalendar() {
    const monthYearDisplay = document.getElementById('calendarMonth');
    const daysGrid = document.getElementById('calendarDays');

    monthYearDisplay.textContent = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    daysGrid.innerHTML = ''; // Limpa os dias anteriores

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const numDays = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Segunda...

    // Preenche os dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'other-month'); // Para estilizar dias de outros meses
        daysGrid.appendChild(emptyDiv);
    }

    // Preenche os dias do mês
    for (let day = 1; day <= numDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        // Marca o dia atual
        const today = new Date();
        if (dateToCheck.toDateString() === today.toDateString()) {
            dayDiv.classList.add('today');
        }

        // Marca o dia selecionado
        if (selectedDate && dateToCheck.toDateString() === selectedDate.toDateString()) {
            dayDiv.classList.add('selected');
        }

        dayDiv.addEventListener('click', function() {
            // Atualiza a data selecionada e renderiza o calendário novamente
            selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

            // Log para verificar a data que será usada
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const dayOfMonth = String(selectedDate.getDate()).padStart(2, '0');
            const dateStringForFetch = `${year}-${month}-${dayOfMonth}`;
            console.log(`[AGENDA JS - CLICK] Data clicada e formatada para fetch: ${dateStringForFetch}`);


            renderCalendar(); // Re-renderiza para atualizar a classe 'selected'
            updateCurrentDateDisplay(); // Atualiza a exibição da data atual
            fetchTasksForSelectedDate(); // Carrega tarefas para a nova data selecionada
        });

        daysGrid.appendChild(dayDiv);
    }
}

function prevMonth() {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
}

function openTaskForm() {
    // Preenche a data do formulário com a data selecionada no calendário
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    document.getElementById('taskDate').value = `${year}-${month}-${day}`;

    document.getElementById('taskModal').style.display = 'block';
}

function closeTaskForm() {
    document.getElementById('taskModal').style.display = 'none';
    document.getElementById('taskForm').reset(); // Limpa o formulário
}

// Função para abrir o modal de confirmação
function openConfirmModal(taskId) {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.dataset.taskId = taskId; // Armazena o ID da tarefa no botão
    document.getElementById('confirmModal').style.display = 'block';
}

// Função para fechar o modal de confirmação
function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    document.getElementById('confirmDeleteBtn').dataset.taskId = ''; // Limpa o ID da tarefa
}

// --- Funções de Interação com a API ---

async function fetchTasksForSelectedDate() {
    // tasksList e noTasksMessage já foram definidos no DOMContentLoaded
    tasksList.innerHTML = ''; // Limpa a lista de tarefas atual

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    console.log(`[AGENDA JS] Buscando tarefas para a URL: /api/tasks?date=${dateString}`); // Log de depuração

    try {
        const response = await fetch(`/api/tasks?date=${dateString}`);
        console.log('[AGENDA JS] Resposta bruta da API recebida:', response); // Log de depuração

        if (!response.ok) {
            let errorMessage = `Erro HTTP! Status: ${response.status}`;
            try {
                // Tenta ler a mensagem de erro do corpo da resposta, se for JSON
                const errorData = await response.json();
                errorMessage += `, Mensagem da API: ${errorData.message || JSON.stringify(errorData)}`;
            } catch (jsonError) {
                // Se a resposta não for JSON, pegue o texto bruto para depuração
                const responseText = await response.text();
                errorMessage += ` (Resposta não é JSON ou está vazia. Conteúdo: ${responseText.substring(0, 100)}...)`;
            }
            console.error('[AGENDA JS] ERRO na resposta da API (response.ok é false):', errorMessage); // Log de depuração
            throw new Error(errorMessage); // Lança o erro para ser pego pelo catch
        }

        const tasks = await response.json();
        console.log('[AGENDA JS] Tarefas recebidas e parseadas (JSON):', tasks); // Log final de sucesso

        if (tasks.length === 0) {
            noTasksMessage.style.display = 'block';
        } else {
            noTasksMessage.style.display = 'none';
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                // Formata a hora da tarefa
                const taskTime = new Date(task.agtarefadata).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                taskItem.innerHTML = `
                    <div class="task-time">${taskTime}</div>
                    <div class="task-content">
                        <div class="task-title">${task.agtarefanome}</div>
                        <div class="task-discipline">${task.agtarefadesc || ''}</div>
                    </div>
                    <button class="task-delete" onclick="openConfirmModal(${task.agcodigo})"><i class="fas fa-trash"></i></button>
                `;
                tasksList.appendChild(taskItem);
            });
        }
    } catch (error) {
        console.error('[AGENDA JS] ERRO GERAL ao buscar tarefas (código atingiu o catch):', error); // Log de depuração
        // Mostra uma notificação mais detalhada no frontend
        showNotification('error', 'Erro', `Não foi possível carregar as tarefas. Detalhes: ${error.message || 'Verifique o console para mais informações.'}`);
    }
}

async function addTask() {
    const taskDate = document.getElementById('taskDate').value;
    const taskTime = document.getElementById('taskTime').value;
    const taskTitle = document.getElementById('taskTitle').value;
    const taskDiscipline = document.getElementById('taskDiscipline').value;

    if (!taskDate || !taskTime || !taskTitle || !taskDiscipline) {
        showNotification('error', 'Campos obrigatórios', 'Por favor, preencha todos os campos da tarefa!');
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskDate, taskTime, taskTitle, taskDiscipline })
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('success', 'Tarefa Adicionada!', result.message);
            closeTaskForm();
            fetchTasksForSelectedDate(); // Recarrega as tarefas após adicionar
        } else {
            showNotification('error', 'Erro', result.message || 'Erro ao adicionar tarefa.');
        }
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        showNotification('error', 'Erro', 'Ocorreu um erro ao adicionar a tarefa.');
    }
}

async function deleteTaskConfirmed(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('info', 'Tarefa Excluída', result.message);
            fetchTasksForSelectedDate(); // Recarrega as tarefas após excluir
        } else {
            showNotification('error', 'Erro', result.message || 'Erro ao excluir tarefa.');
        }
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        showNotification('error', 'Erro', 'Ocorreu um erro ao excluir a tarefa.');
    }
}