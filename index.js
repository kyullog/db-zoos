const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const { development } = require('./data/knexfile')
const db = knex(development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
// add new zoo record endpoint
server.post('/api/zoos', async (req, res) => {
  try {
  if (!req.body.name) {
    res.status(400).json({message: "Please provide a name"})
  } else {
    const newZoo = req.body;
    const postedZoo = await db('zoos').insert(newZoo);
    res.status(201).json({id: Number(postedZoo)})
  }
  } catch (err) {
    res.status(500).json({err: "There was a problem adding the record"})
  } 
})

// get all zoos endpoint
server.get('/api/zoos', async (req, res) => {
  try {
    const getZoos = await db.select().from('zoos');
    res.status(200).json(getZoos);
  } catch (err) {
    res.status(500).json({error: "There was problem processing your request",
  err})
  }
})

// get zoo by id endpoint
server.get('/api/zoos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const getZoo = await db('zoos').where({id: id}).first();
    if (getZoo) {
    res.status(200).json(getZoo);
    } else {
      res.status(404).json({error: "There is no record by that id"})
    }
  } catch {
    res.status(500).json({error: "There was a problem processing your request"})
  }
})

//delete zoo record by id
server.delete('/api/zoos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await db('zoos').where({id: id}).del();
    console.log(deleted);
    if (deleted) {
    res.status(200).json({message: "Record deleted"})
    } else {
      res.status(400).json({error: "No record with that id to be deleted"})
    }
  } catch {
    res.status(500).json({error: "There was a problem processing your request"})
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
