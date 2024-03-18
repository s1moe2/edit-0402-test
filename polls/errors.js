class NotFoundError extends Error {
  constructor(entity) {
    super(`${entity} not found`);
    this.name = 'NotFoundError';
  }
}

class ExpiredPollError extends Error {
    constructor(pollId) {
      super(`poll with id ${pollId} has expired`);
      this.name = 'ExpiredPollError';
    }
  }

module.exports = {
    NotFoundError,
    ExpiredPollError,
}