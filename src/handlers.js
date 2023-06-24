class AbstractHandler {
  constructor() {
    this._nextHandler = null;
  }

  setNext(handler) {
    this._nextHandler = handler;
    return handler;
  }

  filter(value) {
    throw new Error('Method "filter" must be implemented.');
  }
}

module.exports = AbstractHandler;
