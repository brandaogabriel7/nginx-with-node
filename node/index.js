const express = require('express');
const app = express();
const PORT = 3000;

const DEFAULT_PERSON = 'Brands';

const MYSQL_CONFIG = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

const CREATE_PEOPLE_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS people(
    id int not null auto_increment,
    name varchar(255),
    primary key(id)
  )`;

const GET_ALL_PEOPLE_QUERY = 'SELECT * FROM people;';

const createPeopleTableIfNotExists = (mysql, config) => {
  const connection = mysql.createConnection(config);
  connection.query(CREATE_PEOPLE_TABLE_QUERY);
  connection.end();
};

const insertNewPerson = (person, connection) => {
  const insertPersonQuery = `INSERT INTO people(name) values('${person}')`;
  connection.query(insertPersonQuery);
};

const fullCycleRocksPage = (connection, res) => {
  connection.query(GET_ALL_PEOPLE_QUERY, (error, results, fields) => {
    if (error) throw error;
    let response = '<h1>Full Cycle Rocks!</h1><ul>';
    results.forEach((item) => {
      response += `<li>${item.name}</li>`;
    });
    response += '</ul>';
    res.send(response);
  });
};

const mysql = require('mysql');

createPeopleTableIfNotExists(mysql, MYSQL_CONFIG);

app.get('/', (req, res) => {
  const connection = mysql.createConnection(MYSQL_CONFIG);

  insertNewPerson(DEFAULT_PERSON, connection);

  fullCycleRocksPage(connection, res);

  connection.end();
});

app.get('/:name', (req, res) => {
  const connection = mysql.createConnection(MYSQL_CONFIG);

  insertNewPerson(req.params.name, connection);

  fullCycleRocksPage(connection, res);

  connection.end();
});

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
