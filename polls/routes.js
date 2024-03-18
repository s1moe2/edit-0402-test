const express = require("express");
const router = express.Router();
const schemas = require("./schemas");
const services = require("./services");
const { auth } = require("../middleware");
const { NotFoundError, ExpiredPollError } = require("./errors");

router.get("/", async (req, res) => {
  const polls = await services.getAllPolls();
  res.status(200).json(polls);
});

router.get("/:id", async (req, res) => {
  const poll = await services.getPollById(req.params.id);
  if (!poll) {
    return res.status(200).json({ error: "poll not found" });
  }
  res.status(200).json(poll);
});

router.use(auth);

router.post("/", auth, async (req, res) => {
  const { error, value } = schemas.createPollSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  const newPoll = await services.createPoll(value);
  if (!newPoll) {
    return res.status(500).json({ error: "failed to create poll" });
  }

  res.status(201).json(newPoll);
});

router.post("/:id/votes", auth, async (req, res) => {
  const { error, value } = schemas.voteSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  const voteRes = await services.vote(req.params.id, value.option);
  if (!voteRes) {  
    return res.status(500).json({ error: "failed to register vote" });
  }
  if (voteRes instanceof NotFoundError) {
    return res.status(404).json({ error: voteRes.message });
  }
  if (voteRes instanceof ExpiredPollError) {
    return res.status(400).json({ error: voteRes.message });
  }

  res.status(200).json({ message: "vote registered successfully" });
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
