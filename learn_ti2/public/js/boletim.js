// public/js/boletim.js

// Variáveis para os elementos HTML, declaradas aqui para serem acessíveis em todo o módulo
let gradesTableBody;
let semesterSelect;
let addGradeBtn;
let gradeModal;
let closeModal;
let gradeForm;
let modalTitle;
let editBoletimIdInput;
let gradeDisciplineSelect;
let noGradesMessage; // Garanta que esta variável esteja declarada no topo

// Dados de disciplinas (serão preenchidos via API)
let availableDisciplines = [];

document.addEventListener('DOMContentLoaded', function() {
    // **OBTENHA AS REFERÊNCIAS AOS ELEMENTOS HTML AQUI DENTRO,
    // APÓS GARANTIR QUE O DOM ESTÁ PRONTO.**
    gradesTableBody = document.getElementById('gradesTableBody');
    semesterSelect = document.getElementById('semesterSelect');
    addGradeBtn = document.getElementById('addGradeBtn');
    gradeModal = document.getElementById('gradeModal');
    closeModal = document.getElementById('closeModal');
    gradeForm = document.getElementById('gradeForm');
    modalTitle = document.getElementById('modalTitle');
    editBoletimIdInput = document.getElementById('editBoletimId');
    gradeDisciplineSelect = document.getElementById('gradeDiscipline');
    noGradesMessage = document.getElementById('noGradesMessage'); // O elemento que estava dando null

    // Event Listeners
    semesterSelect.addEventListener('change', fetchAndRenderGrades);
    addGradeBtn.addEventListener('click', () => openGradeModal());
    closeModal.addEventListener('click', closeGradeModal);

    gradeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveGrade();
    });

    // Inicialização: buscar disciplinas e depois carregar notas
    initializeBoletim();

    // Adiciona as funções ao escopo global para os eventos onclick (Edit/Delete)
    window.editGrade = editGrade;
    window.deleteGrade = deleteGrade;
});

async function fetchDisciplines() {
    try {
        const response = await fetch('/api/disciplines'); // Chama a rota no backend para obter disciplinas
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const disciplines = await response.json();
        availableDisciplines = disciplines; // Armazena globalmente para uso futuro

        // Preenche o select de disciplinas no modal
        gradeDisciplineSelect.innerHTML = '<option value="">Selecione...</option>'; // Opção padrão
        disciplines.forEach(disc => {
            const option = document.createElement('option');
            option.value = disc.disccodigo; // O valor será o disccodigo da disciplina
            option.textContent = disc.discnome; // O texto visível será o nome da disciplina
            gradeDisciplineSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
        showNotification('error', 'Erro', 'Não foi possível carregar as disciplinas para seleção.');
    }
}

async function initializeBoletim() {
    await fetchDisciplines(); // Primeiro, busca as disciplinas
    await fetchAndRenderGrades(); // Depois, busca e renderiza as notas
}

// Funções auxiliares
function calculateAverage(n1, n2, n3) {
    if (n1 === null || n2 === null || n3 === null) return 'N/A';
    return ((parseFloat(n1) + parseFloat(n2) + parseFloat(n3)) / 3).toFixed(1);
}

function getSituation(average) {
    if (average === 'N/A') return 'Pendente';
    return parseFloat(average) >= 6 ? "Aprovado" : "Reprovado";
}

// --- Funções de Interação com a API ---

// Busca as disciplinas disponíveis para o select
async function fetchDisciplines() {
    try {
        const response = await fetch('/api/disciplines');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const disciplines = await response.json();
        availableDisciplines = disciplines;

        gradeDisciplineSelect.innerHTML = '<option value="">Selecione...</option>';
        disciplines.forEach(disc => {
            const option = document.createElement('option');
            option.value = disc.disccodigo;
            option.textContent = disc.discnome;
            gradeDisciplineSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar disciplinas:', error);
        showNotification('error', 'Erro', 'Não foi possível carregar as disciplinas para seleção.');
    }
}

// Busca e renderiza as notas do semestre selecionado
async function fetchAndRenderGrades() {
    // **NÃO REDEFINA AQUI, USE AS VARIÁVEIS GLOBAIS JÁ OBTIDAS NO DOMContentLoaded**
    // const gradesTableBody = document.getElementById('gradesTableBody'); // REMOVER
    // const noGradesMessage = document.getElementById('noGradesMessage'); // REMOVER

    gradesTableBody.innerHTML = ''; // Limpa a tabela

    const semesterYear = semesterSelect.value; // Ex: '2025-1'

    try {
        const response = await fetch(`/api/grades?semesterYear=${semesterYear}`);
        if (!response.ok) {
            let errorMessage = `Erro HTTP! Status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage += `, Mensagem da API: ${errorData.message || JSON.stringify(errorData)}`;
            } catch (jsonError) {
                const responseText = await response.text();
                errorMessage += ` (Resposta não é JSON ou está vazia. Conteúdo: ${responseText.substring(0, 100)}...)`;
            }
            throw new Error(errorMessage);
        }
        const grades = await response.json();

        if (grades.length === 0) {
            noGradesMessage.style.display = 'table-row'; // Acessa a variável global
        } else {
            noGradesMessage.style.display = 'none'; // Acessa a variável global
            grades.forEach(grade => {
                const average = calculateAverage(grade.n1, grade.n2, grade.n3);
                const situation = getSituation(average);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${grade.discipline}</td>
                    <td>${grade.n1 !== null ? grade.n1 : '-'}</td>
                    <td>${grade.n2 !== null ? grade.n2 : '-'}</td>
                    <td>${grade.n3 !== null ? grade.n3 : '-'}</td>
                    <td>${average}</td>
                    <td class="situation ${situation === 'Aprovado' ? 'aprovado' : (situation === 'Reprovado' ? 'reprovado' : '')}">${situation}</td>
                    <td class="action-buttons">
                        <button class="edit-btn" onclick="editGrade('${grade.bocodigo}', '${grade.disccodigo}', ${grade.n1 || 0}, ${grade.n2 || 0}, ${grade.n3 || 0})"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" onclick="deleteGrade('${grade.bocodigo}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                gradesTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar e renderizar notas:', error);
        showNotification('error', 'Erro', `Não foi possível carregar as notas do boletim. Detalhes: ${error.message || 'Verifique o console.'}`);
    }
}

async function saveGrade() {
    const bocodigo = editBoletimIdInput.value;
    const disciplineId = gradeDisciplineSelect.value;
    const n1 = parseFloat(document.getElementById('gradeN1').value);
    const n2 = parseFloat(document.getElementById('gradeN2').value);
    const n3 = parseFloat(document.getElementById('gradeN3').value);
    const semesterYear = semesterSelect.value;

    if (!disciplineId || isNaN(n1) || isNaN(n2) || isNaN(n3)) {
        showNotification('error', 'Campos inválidos', 'Por favor, preencha todos os campos corretamente.');
        return;
    }
    if (n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10 || n3 < 0 || n3 > 10) {
        showNotification('error', 'Notas inválidas', 'As notas devem estar entre 0 e 10.');
        return;
    }

    const payload = { disciplineId, n1, n2, n3, semesterYear };

    const method = bocodigo ? 'PUT' : 'POST';
    const url = bocodigo ? `/api/grades/${bocodigo}` : '/api/grades';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('success', 'Sucesso!', result.message);
            closeGradeModal();
            fetchAndRenderGrades();
        } else {
            showNotification('error', 'Erro', result.message || 'Erro ao salvar notas.');
        }
    } catch (error) {
        console.error('Erro ao salvar notas:', error);
        showNotification('error', 'Erro', 'Ocorreu um erro ao salvar as notas.');
    }
}

function openGradeModal(boletimId = null, disciplineId = '', n1 = '', n2 = '', n3 = '') {
    if (boletimId) {
        modalTitle.textContent = 'Editar Nota';
        editBoletimIdInput.value = boletimId;
        gradeDisciplineSelect.value = disciplineId;
        gradeDisciplineSelect.disabled = true; // Desabilita o select na edição
        document.getElementById('gradeN1').value = n1;
        document.getElementById('gradeN2').value = n2;
        document.getElementById('gradeN3').value = n3;
    } else {
        modalTitle.textContent = 'Adicionar Nota';
        editBoletimIdInput.value = '';
        gradeForm.reset();
        gradeDisciplineSelect.disabled = false; // Habilita o select na adição
    }
    gradeModal.style.display = 'block';
}

function closeGradeModal() {
    gradeModal.style.display = 'none';
}

function editGrade(boletimId, disciplineId, n1, n2, n3) {
    openGradeModal(boletimId, disciplineId, n1, n2, n3);
}

async function deleteGrade(boletimId) {
    if (!confirm('Deseja realmente excluir este registro de notas da disciplina?')) {
        return;
    }

    try {
        const response = await fetch(`/api/grades/${boletimId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('info', 'Sucesso', result.message);
            fetchAndRenderGrades();
        } else {
            showNotification('error', 'Erro', result.message || 'Erro ao excluir notas.');
        }
    } catch (error) {
        console.error('Erro ao excluir notas:', error);
        showNotification('error', 'Erro', 'Ocorreu um erro ao excluir as notas.');
    }
}