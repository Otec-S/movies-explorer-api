class Forbidden403Error extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = Forbidden403Error;
