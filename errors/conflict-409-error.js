class Conflict409Error extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = Conflict409Error;
