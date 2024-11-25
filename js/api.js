const express = require('express');
const { Client } = require('pg');  // Usando o pacote 'pg' para PostgreSQL
const cors = require('cors');

const app = express();
const port = 3000;

// Configuração do banco de dados PostgreSQL
const db = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'postgre',
    database: 'db_CinemaGalaxy',
    port: 5432 // Porta padrão do PostgreSQL
});

// Conectar ao banco de dados de forma assíncrona
async function connectToDB() {
    try {
        await db.connect(); // Conecta ao banco de dados
        console.log('Conectado ao banco de dados!');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        process.exit(1); // Sai da aplicação em caso de erro
    }
}

// Conectar ao banco de dados
connectToDB();

// Configuração de middlewares
app.use(cors());
app.use(express.json()); // Para lidar com JSON no corpo das requisições

// Rota para listar os filmes
app.get('/filmes', async (req, res) => {
    const query = `
        SELECT
            Filme.ID_Filme,
            Filme.Titulo,
            Filme.Poster_Link,
            Diretor.Nome AS Nome_Diretor,
            Studio.Nome_Studio,
            Classificacao.Faixa_Etaria
        FROM Filme
        JOIN Diretor ON Filme.ID_Diretor = Diretor.ID_Diretor
        JOIN Studio ON Filme.ID_Studio = Studio.ID_Studio
        JOIN Classificacao ON Filme.ID_Classificacao = Classificacao.ID_Classificacao
        ORDER BY Filme.ID_Filme DESC;
    `;
    
    try {
        const result = await db.query(query);
        res.json(result.rows);  // Retorna os filmes encontrados
        console.log(result);
    } catch (err) {
        console.error('Erro ao buscar filmes:', err);
        res.status(500).send('Erro ao buscar filmes');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
