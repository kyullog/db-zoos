const express = require('express');

const bearRouter = express.Router();

const db = require('../data/dbConfig');

bearRouter.get('/', async (req, res) => {
  try {
    const bears = await db.select().from('bears');
    res.status(200).json(bears);
  } catch {
    res.status(500).json({error: "There was a problem processing your request"})
  }
})

bearRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const bear = await db('bears').where({id: id}).first();
    console.log(bear);
    res.status(200).json(bear);
  } catch {
    res.status(500).json({error: "There was a problem processing your request"})
  }
})

module.exports = bearRouter;
