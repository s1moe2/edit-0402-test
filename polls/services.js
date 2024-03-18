const db = require("../db/mongodb");
const { NotFoundError, ExpiredPollError } = require("./errors");

async function getPollById(pollId) {
  try {
    return await db
      .getDB()
      .collection(db.pollsCollection)
      .findOne({ _id: db.toMongoID(pollId) });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAllPolls() {
  try {
    return await db.getDB().collection(db.pollsCollection).find({}).toArray();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createPoll(poll) {
  try {
    poll.options = poll.options.map((option) => ({
      option: option,
      votes: 0,
    }));

    const insertRes = await db
      .getDB()
      .collection(db.pollsCollection)
      .insertOne(poll);

    if (!insertRes?.insertedId) {
      return null;
    }

    return await getPollById(insertRes.insertedId)
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function vote(id, option) {
  try {
    const poll = await getPollById(id);
    if(!poll) {
      return new NotFoundError("poll")
    }

    if (poll.expiresAt < new Date()) {
      return new ExpiredPollError(poll._id);
    }

    const updateRes = await db
      .getDB()
      .collection(db.pollsCollection)
      .updateOne(
        { _id: db.toMongoID(id), "options.option": option },
        { $inc: { "options.$.votes": 1 } }
      );

    return updateRes?.modifiedCount === 1
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function deletePollById(pollId) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .deleteOne({ _id: db.toMongoID(pollId) });

    return result.deletedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getPollById,
  getAllPolls,
  deletePollById,
  createPoll,
  vote,
};
