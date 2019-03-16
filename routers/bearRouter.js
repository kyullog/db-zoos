const express = require('express');

const bearRouter = express.Router();

const db = require('../data/dbConfig');

bearRouter.get('/', async (req, res) => {
  try {
    const bears = await db.select().from('bears');
    console.log(bears);
    res.status(200).json(bears);
  } catch {
    res.status(500).json({err: "There was a problem processing your request"})
  }
})

module.exports = bearRouter;
