const express = require('express');

const zooRouter = express.Router();

const db = require('../data/dbConfig')

zooRouter.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      res.status(400).json({ message: "Please provide a name" });
    } else {
      const newZoo = req.body;
      const postedZoo = await db("zoos").insert(newZoo);
      res.status(201).json({ id: Number(postedZoo) });
    }
  } catch (err) {
    res.status(500).json({ error: "There was a problem adding the record" });
  }
});

// get all zoos endpoint
zooRouter.get("/", async (req, res) => {
  try {
    const getZoos = await db.select().from("zoos");
    res.status(200).json(getZoos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "There was problem processing your request", err });
  }
});

// get zoo by id endpoint
zooRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const getZoo = await db("zoos")
      .where({ id: id })
      .first();
    if (getZoo) {
      res.status(200).json(getZoo);
    } else {
      res.status(404).json({ error: "There is no record by that id" });
    }
  } catch {
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

//delete zoo record by id
zooRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await db("zoos")
      .where({ id: id })
      .del();
    console.log(deleted);
    if (deleted) {
      res.status(200).json({ message: "Record deleted" });
    } else {
      res.status(400).json({ error: "No record with that id to be deleted" });
    }
  } catch {
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

//update record by id
zooRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const newName = req.body.name;
    const updated = await db("zoos")
      .where({ id: id })
      .update({ name: newName });
    console.log(updated);
    if (updated) {
      res.status(201).json({ message: "Record was updated" });
    } else {
      res.status(400).json({ error: "There was problem editing the record" });
    }
  } catch {
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});



module.exports = zooRouter;