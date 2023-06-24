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

  _filter(value, chain_filter) {
    if (chain_filter && value) {
      value = chain_filter.filter(value);
    }
    return value;
  }

  reset() {
    this.content_upper = this.content.toUpperCase();
    this.cursor = this.content;
    this.cursor_upper = this.content_upper;
    this.field = null;
    this.field_upper = null;
  }

  value(uppercase = false, chain_filter = null) {
    const filtered = this._filter(this.field, uppercase.chain_filter);
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

  parse(tag_name) {
    // To be implemented in subclasses
  }
}

module.exports = TextParser;
