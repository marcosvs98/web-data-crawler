const logger = require('logging');
const {
  EndTokenNotFoundParserException,
  InvalidTagParserException,
  StartTokenNotFoundParserException,
  TagNotFoundParserException
} = require('./exceptions');

const TextParser = require('./text_parser');

class SequentialTextParser extends TextParser {
  constructor() {
    super();
  }

  parse(tag_name, replace_map = {}) {
    for (const parameter of this.parameters) {
      if (parameter.name === tag_name) {
        let start_tag = parameter.start_tag.toUpperCase();
        let end_tag = parameter.end_tag.toUpperCase();

        for (const [old, value] of Object.entries(replace_map)) {
          if (old && value !== undefined) {
            start_tag = start_tag.replace(old.toUpperCase(), value.toUpperCase());
            end_tag = end_tag.replace(old.toUpperCase(), value.toUpperCase());
          }
        }

        if (!start_tag) {
          console.log(`Error while processing tag: ${tag_name}.`);
          throw new InvalidTagParserException(tag_name);
        }

        let start_block, token, end_block;
        [start_block, token, end_block] = this.partition(this.cursor_upper, start_tag);

        if (!token) {
          console.log(`Start token not found for tag: ${tag_name}.`);
          throw new StartTokenNotFoundParserException(tag_name);
        }

        const offset = start_block.length + token.length;

        if (end_tag) {
          [start_block, token, end_block] = this.partition(end_block, end_tag);

          if (!token) {
            console.log(`End token not found for tag: ${tag_name}.`);
            throw new EndTokenNotFoundParserException(tag_name);
          }

          this.field_upper = start_block;
          this.cursor_upper = end_block;
        } else {
          [this.field_upper, token, this.cursor_upper] = this.partition(end_block, start_tag);
          this.cursor_upper = token + this.cursor_upper;
        }

        this.field = this.cursor.substring(offset, offset + this.field_upper.length);
        this.cursor = this.cursor.substring(this.cursor.length - this.cursor_upper.length);

        return this;
      }
    }

    console.log(`Tag ${tag_name} not found during parsing.`);
    throw new TagNotFoundParserException(tag_name);
  }
}

module.exports = {SequentialTextParser};
