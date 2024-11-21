// Importação 
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

// Conectando com banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     
  password: '@Dougl4zzz',      
  database: 'sistema_tarefas'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao banco de dados!');
});

// Rotas
app.get('/tarefas', (req, res) => {
  const query = 'SELECT * FROM Tarefas ORDER BY ordem';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/tarefas', (req, res) => {
  const { nome, custo, data_limite } = req.body;
  const query = 'INSERT INTO Tarefas (nome, custo, data_limite, ordem) SELECT ?, ?, ?, COALESCE(MAX(ordem), 0) + 1 FROM Tarefas';
  db.query(query, [nome, custo, data_limite], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId });
  });
});

app.put('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;
  const query = 'UPDATE Tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?';
  db.query(query, [nome, custo, data_limite, id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.delete('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Tarefas WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001!');
});
