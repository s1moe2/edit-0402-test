const express = require("express");
const router = express.Router();
const services = require("./services");
const { pollsCollection } = require("../db/mongodb");

router.get("/", async (req, res) => {
  const polls = await services.getAllPolls();
  res.status(200).json(polls);
});
// tarefa 1
router.get("/:id", async (req, res) => {
  const poll = await services.getPollById(req.params.id);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }
  res.status(200).json(poll);
});

router.post("/creat/:id", async (req, res) => {
  const { error, value } = await schemas.pollsCollection.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  const creatPoll = await services.creatPoll(value);
  res.status(201).json(creatPoll);
});

router.delete("/:id", async (req, res) => {
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }

  const deleted = await services.deletePollById(pollId);
  if (!deleted) {
    return res.status(500).json({ error: "failed to delete poll" });
  }

  res.status(200).json({ message: "poll deleted successfully" });
});

module.exports = router;
