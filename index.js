const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const { development } = require('./data/knexfile')
const db = knex(development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.get('/api/zoos', async (req, res) => {
  try {
    const getZoos = await db.select().from('zoos');
    console.log(getZoos);
    res.status(200).json(getZoos);
  } catch (err) {
    console.log(err);
    res.status(500).json({error: "There was problem processing your request",
  err})
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
