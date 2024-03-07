const express = require("express");
const router = express.Router();
const services = require("./services");
const { pollsCollection } = require("../db/mongodb");
const { isSchema } = require("joi");
const { createPollSchema, voteSchema } = require("./schemas");
const middle = require("../middleware"); //tarefa 4 criada

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

//tarefa 2
router.post("/", middle.auth, async (req, res) => {
  const { error, value } = createPollSchema.validate(req.body);
  if (error) {
    console.log("erro na validação", error);
    return res.status(400).json(error.details);
  }

  console.log("Dados válidos: ", value);

  value.options = value.options.map((opt) => {
    return {
      name: opt,
      votes: 0,
    };
  });

  const createPollResult = await services.createPoll({
    question: value.question,
    options: value.options,
    deadline: value.deadline,
  });

  const result = await services.getPollById(createPollResult.insertedId);
  res.status(201).json(result);
});

//tarefa 3
router.post("/:pollId/vote", middle.auth, async (req, res) => {
  const { error, value } = voteSchema.validate(req.body);
  if (error) {
    return res.status(404).json(error.details);
  }

  const poll = await services.getPollById(req.params.pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }
  const optionExists = poll.options.some(
    (option) => option.name === value.option
  );
  if (!optionExists) {
    return res.status(400).json({ error: "invalid option" });
  }
  const currentDateTime = new Date();
  const pollDeadline = new Date(poll.deadline); // tarefa 6

  if (currentDateTime > pollDeadline) {
    return res.status(400).json({ error: "A data limite para votar expirou!" });
  }

  const updatedPoll = await services.voteOption(
    req.params.pollId,
    value.option
  );

  res.status(200).json(updatedPoll);
});

router.delete("/:id", middle.auth, async (req, res) => {
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
