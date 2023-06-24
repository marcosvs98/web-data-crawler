const { NotImplementedError } = require('util');

class ContentParser {
  constructor(template, content, filters = {}, text_parser_static = null, text_parser_sequential = null) {
    this.template = template;
    this._content = String(content);
    this.filters = filters;

    this.content_upper = this._content.toUpperCase();

    if (text_parser_static) {
      text_parser_static.set_content(this._content);
      text_parser_static.reset();
      text_parser_static.parameters = this.template.parameters;
      text_parser_static.content_parser = this;
      this.text_parser_static = text_parser_static;
    } else {
      this.text_parser_static = null;
    }

    if (text_parser_sequential) {
      text_parser_sequential.set_content(this._content);
      text_parser_sequential.reset();
      text_parser_sequential.parameters = this.template.parameters;
      text_parser_sequential.content_parser = this;
      this.text_parser_sequential = text_parser_sequential;
    } else {
      this.text_parser_sequential = null;
    }
  }

  get content() {
    return this._content;
  }

  set content(value) {
    this._content = String(value);
    if (this.text_parser_static) {
      this.text_parser_static.set_content(this._content);
    }
    if (this.text_parser_sequential) {
      this.text_parser_sequential.set_content(this._content);
    }
  }

  parse() {
    throw new NotImplementedError('Method parse() must be implemented by subclasses.');
  }
}

module.exports = ContentParser;
