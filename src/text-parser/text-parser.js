class TextParser {
  constructor() {
    this.parameters = null;
    this.content = '';
    this.reset();
  }

  set_content(content) {
    this.content = content;
    this.reset();
  }

  _filter(value, chainFilter) {
    if (chainFilter && value) {
      value = chainFilter.filter(value);
    }
    return value;
  }

  reset() {
    this.contentUpper = this.content.toUpperCase();
    this.cursor = this.content;
    this.cursorUpper = this.contentUpper;
    this.field = null;
    this.fieldUpper = null;
  }

  value(uppercase = false, chainFilter = null) {
    const filtered = this._filter(this.field, uppercase.chainFilter);
    if (uppercase.uppercase && typeof filtered === 'string') {
      return filtered.toUpperCase();
    }
    return filtered;
  }

  partition(str, separator) {
    const index = str.indexOf(separator);
    if (index === -1) {
      return [str, '', ''];
    }

    const partitioned = [
      str.substring(0, index),
      separator,
      str.substring(index + separator.length)
    ];

    return partitioned;
  }

  parse(tagName) {
    // To be implemented in subclasses
  }
}

module.exports = TextParser;
