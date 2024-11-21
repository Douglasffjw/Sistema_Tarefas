const API_URL = 'http://localhost:3001';
let tarefas = [];  // Define a variável global

async function carregarTarefas() {
  const response = await fetch(`${API_URL}/tarefas`);
  tarefas = await response.json();  // Atualiza a variável global
  const tabela = document.getElementById('tarefas-tabela');
  tabela.innerHTML = '';
  tarefas.forEach(tarefa => {
    const row = document.createElement('tr');
    if (tarefa.custo >= 1000) {
      row.classList.add('highlight');  // Adiciona a classe 'highlight' se o custo for >= 1000
    }
    row.innerHTML = `
      <td>${tarefa.nome}</td>
      <td>R$${tarefa.custo}</td>
      <td>${tarefa.data_limite}</td>
      <td>
        <button onclick="editarTarefa(${tarefa.id})">✏️</button>
        <button onclick="excluirTarefa(${tarefa.id})">❌</button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

async function excluirTarefa(id) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    const response = await fetch(`${API_URL}/tarefas/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Tarefa excluída com sucesso!');
      carregarTarefas(); // Atualiza a lista
    } else {
      alert('Erro ao excluir tarefa!');
    }
  }
}

function abrirFormulario() {
  document.getElementById('formulario-tarefa').style.display = 'block';
}

function fecharFormulario() {
  document.getElementById('formulario-tarefa').style.display = 'none';
}

async function salvarTarefa() {
  const nome = document.getElementById('nome').value;
  const custo = parseFloat(document.getElementById('custo').value);
  const data_limite = document.getElementById('data_limite').value;

  if (!nome || !custo || !data_limite) {
    alert('Preencha todos os campos!');
    return;
  }

  const response = await fetch(`${API_URL}/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, custo, data_limite })
  });

  if (response.ok) {
    alert('Tarefa adicionada com sucesso!');
    fecharFormulario();
    carregarTarefas();
  } else {
    alert('Erro ao adicionar tarefa!');
  }
}

function editarTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id); // Encontra a tarefa na lista carregada
  if (!tarefa) return;

  document.getElementById('id-edicao').value = id;
  document.getElementById('nome-edicao').value = tarefa.nome;
  document.getElementById('custo-edicao').value = tarefa.custo;
  document.getElementById('data_limite-edicao').value = tarefa.data_limite;

  document.getElementById('formulario-edicao').style.display = 'block';
}

function fecharEdicao() {
  document.getElementById('formulario-edicao').style.display = 'none';
}

async function salvarEdicao() {
  const id = document.getElementById('id-edicao').value;
  const nome = document.getElementById('nome-edicao').value;
  const custo = parseFloat(document.getElementById('custo-edicao').value);
  const data_limite = document.getElementById('data_limite-edicao').value;

  if (!nome || !custo || !data_limite) {
    alert('Preencha todos os campos!');
    return;
  }

  const response = await fetch(`${API_URL}/tarefas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, custo, data_limite })
  });

  if (response.ok) {
    alert('Tarefa editada com sucesso!');
    fecharEdicao();
    carregarTarefas();
  } else {
    alert('Erro ao editar tarefa!');
  }
}

carregarTarefas();
