const express = require("express");

const bearRouter = express.Router();

const db = require("../data/dbConfig");

// get all bears from bears table
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

//get bear by id from bears table
bearRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const bear = await db("bears")
      .where({ id: id })
      .first();
    res.status(200).json(bear);
  } catch (err) {
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

//add bear to bears table
bearRouter.post("/", async (req, res) => {
  try {
    const newBear = req.body;

    //check and see if zoo exists
    const validZoo = await db("zoos")
      .select()
      .where({ id: newBear.zooID });
    if (!validZoo.length) {
      //if zoo does not exist, responds with error
      res.status(400).json({ error: "Please include a valid zoo id" });
    } else if (!newBear.name || !newBear.zooID) {
      // if required fields aren't filled, responds with error
      res
        .status(400)
        .json({ error: "Please include a name and zooID for the bear" });
    } else {
      //if requirements are met, attempts to post new bear in bears table
      const success = await db("bears").insert({
        name: newBear.name,
        zooID: newBear.zooID
      });
      res.status(201).json({ id: success.join("") });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

module.exports = bearRouter;
