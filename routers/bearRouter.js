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
    if (bear) {
      res.status(200).json(bear);
    } else {
      res.status(400).json({ error: "No bear by that ID exists" });
    }
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

//delete bear by id
bearRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await db("bears")
      .where({ id: id })
      .del();
    console.log(deleted);
    if (deleted) {
      //return success message if deleted
      res.status(200).json({ message: "Record deleted" });
    } else {
      //return error message if record does not exist
      res.status(400).json({ error: "No record with that id to be deleted" });
    }
  } catch {
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

bearRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const editBear = req.body;

  try {
    //checks if zooID is being updated
    if (editBear.zooID) {
      //verifies new zooID exists in zoos table
      const updateZoo = await db("zoos").where({ id: editBear.zooID });
      //checks to see if empty array was returned and responds accordingly
      if (!updateZoo.length) {
        res.status(400).json({ error: "Please use a valid zoo id" });
      } else {
        //updates name and zooID
        const updateWithZoo = await db("bears")
          .where({ id: id })
          .update({ name: editBear.name, zooID: editBear.zooID });
        res.status(201).json({message: `Records updated: ${updateWithZoo}`})
      }
    } else {
      //runs update without zooID column included
      const updateName = await db("bears")
        .where({ id: id })
        .update({ name: editBear.name });
      console.log(updateName);
      if (updateName) {
        res.status(201).json({ message: "Record was updated" });
      } else {
        res.status(400).json({ error: "There was a problem editing the record" });
      }
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "There was a problem processing your request" });
  }
});

module.exports = bearRouter;
