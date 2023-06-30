const { NotImplementedError } = require('util');

class ContentParser {
  constructor(template, content, filters = {}, staticTextParser = null, sequentialTextParser = null) {
    this.template = template;
    this._content = String(content);
    this.filters = filters;

    this.contentUpper = this._content.toUpperCase();

    if (staticTextParser) {
      staticTextParser.set_content(this._content);
      staticTextParser.reset();
      staticTextParser.parameters = this.template.parameters;
      staticTextParser.content_parser = this;
      this.staticTextParser = staticTextParser;
    }

    if (sequentialTextParser) {
      sequentialTextParser.set_content(this._content);
      sequentialTextParser.reset();
      sequentialTextParser.parameters = this.template.parameters;
      sequentialTextParser.content_parser = this;
      this.sequentialTextParser = sequentialTextParser;
    }
  }

  get content() {
    return this._content;
  }

  set content(value) {
    this._content = String(value);
    if (this.staticTextParser) {
      this.staticTextParser.set_content(this._content);
    }
    if (this.sequentialTextParser) {
      this.sequentialTextParser.set_content(this._content);
    }
  }

  parse() {
    throw new NotImplementedError('Method parse() must be implemented by subclasses.');
  }
}

module.exports = ContentParser;
