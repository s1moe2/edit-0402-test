const express = require("express");
const router = express.Router();
const schemas = require("./schemas");
const services = require("./services");
const { getDB } = require("../db/mongodb");
const { getPollById } = require("../polls/services");

router.post("/signin", async (req, res) => {
  const { error, value } = schemas.signinSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: "invalid body", details: error.details });
  }

  const user = await services.findUserByEmail(value.email);
  if (!user) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const isValidPwd = await services.validatePassword(
    value.password,
    user.password
  );
  // tarefa 7//
  if (user.attemptNumber >= 3) {
    return res
      .status(401)
      .json({ error: "Exceeded the number of attempts. blocked user!" });
  }
  if (isValidPwd) {
    services.updatedAttempt(value.email, 0);
  } else {
    const attemptValue = user.attemptNumber + 1;
    services.updatedAttempt(value.email, attemptValue);
  }
  if (!isValidPwd) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const token = services.generateAccessToken(user._id);

  res.status(200).json({ result: "ok", token });
});

router.post("/signup", async (req, res) => {
  const { error, value } = schemas.signupSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: "invalid body", details: error.details });
  }

  const user = await services.findUserByEmail(value.email);
  if (user) {
    return res.status(400).json({ error: "email already in use" });
  }

  const newUser = await services.createUser(value);
  if (!newUser) {
    return res.status(500).json({ error: "unexpected server error" });
  }

  res.status(200).json({
    id: newUser._id,
    email: newUser.email,
    name: newUser.name,
  });
});

module.exports = router;
