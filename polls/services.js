const db = require("../db/mongodb");

async function createPoll(value) {
  try {
    return await db.getDB().collection(db.pollsCollection).insertOne(value);
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function voteOption(pollId, option) {
  try {
    const result = await db
      .getDB()
      .collection(db.pollsCollection)
      .updateOne(
        { _id: db.toMongoID(pollId), "options.name": option },
        { $inc: { "options.$.votes": 1 } }
      );
    if (result.modifiedCount > 0) {
      return await getPollById(pollId);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

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
  voteOption,
};
