class ParserException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ParserException';
  }
}

class InvalidTagParserException extends ParserException {
  constructor(tag_name) {
    super(`Invalid parsing tag: '${tag_name}'.`);
    this.name = 'InvalidTagParserException';
  }
}

class StartTokenNotFoundParserException extends ParserException {
  constructor(tag_name) {
    super(`Start token not found for tag: '${tag_name}'.`);
    this.name = 'StartTokenNotFoundParserException';
  }
}

class EndTokenNotFoundParserException extends ParserException {
  constructor(tag_name) {
    super(`End token not found for tag: '${tag_name}'.`);
    this.name = 'EndTokenNotFoundParserException';
  }
}

class TagNotFoundParserException extends ParserException {
  constructor(tag_name) {
    super(`Tag '${tag_name}' not found during parsing.`);
    this.name = 'TagNotFoundParserException';
  }
}

class TeamCatalogParserException extends ParserException {
  constructor(message) {
    super(`Error during team catalog parsing: ${message}`);
    this.name = 'TeamCatalogParserException';
  }
}

module.exports = {
  ParserException,
  InvalidTagParserException,
  StartTokenNotFoundParserException,
  EndTokenNotFoundParserException,
  TagNotFoundParserException,
  TeamCatalogParserException
};
