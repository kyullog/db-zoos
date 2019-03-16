const express = require("express");

const bearRouter = express.Router();

const db = require("../data/dbConfig");

bearRouter.get("/", async (req, res) => {
  try {
    const bears = await db.select().from("bears");
    res.status(200).json(bears);
  } catch {
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

bearRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const bear = await db("bears")
      .where({ id: id })
      .first();
    console.log(bear);
    res.status(200).json(bear);
  } catch (err) {
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

bearRouter.post("/", async (req, res) => {
  try {
    const newBear = req.body;
    const validZoo = await db('zoos').select().where({ id: newBear.zooID });
    console.log(validZoo);
    if (!validZoo.length) {
      res.status(400).json({ error: "Please include a valid zoo id" });
    }
    else if (!newBear.name || !newBear.zooID) {
      res
        .status(400)
        .json({ error: "Please include a name and zooID for the bear" });
    }  else {
      const success = await db("bears").insert({
        name: newBear.name,
        zooID: newBear.zooID
      });
      console.log(success);
      res.status(201).json({id: success.join('')});
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

module.exports = bearRouter;
