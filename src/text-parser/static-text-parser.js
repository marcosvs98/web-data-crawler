const {
  EndTokenNotFoundParserException,
  InvalidTagParserException,
  StartTokenNotFoundParserException,
  TagNotFoundParserException
} = require('../exceptions/exceptions');

const TextParser = require('./text-parser');

class StaticTextParser extends TextParser {
  constructor() {
    super();
  }

  parse(tagName, replaceMap = {}) {
    for (const parameter of this.parameters) {
      if (parameter.name === tagName) {
        let startTag = parameter.start_tag.toUpperCase();
        let endTag = parameter.end_tag.toUpperCase();

        for (const [old, value] of Object.entries(replaceMap)) {
          if (old && value !== undefined) {
            startTag = startTag.replace(old.toUpperCase(), value.toUpperCase());
            endTag = endTag.replace(old.toUpperCase(), value.toUpperCase());
          }
        }

        if (!startTag) {
          console.log(`Error while processing tag: ${tagName}.`);
          throw new InvalidTagParserException(tagName);
        }

        let startBlock, token, endBlock;
        [startBlock, token, endBlock] = this.partition(this.cursorUpper, startTag);

        if (!token) {
          console.log(`Start token not found for tag: ${tagName}.`);
          throw new StartTokenNotFoundParserException(tagName);
        }

        const offset = startBlock.length + token.length;

        if (endTag) {
          [startBlock, token, endBlock] = this.partition(endBlock, endTag);

          if (!token) {
            console.log(`End token not found for tag: ${tagName}.`);
            throw new EndTokenNotFoundParserException(tagName);
          }

          this.fieldUpper = startBlock;
          this.cursorUpper = endBlock;
        } else {
          [this.fieldUpper, token, this.cursorUpper] = this.partition(endBlock, startTag);
          this.cursorUpper = token + this.cursorUpper;
        }

        this.field = this.cursor.substring(offset, offset + this.fieldUpper.length);
        this.cursor = this.cursor.substring(this.cursor.length - this.cursorUpper.length);

        this.parameters.shift()
        return this;
      }
    }

    console.log(`Tag ${tagName} not found during parsing.`);
    throw new TagNotFoundParserException(tagName);
  }
}

module.exports = {StaticTextParser};
