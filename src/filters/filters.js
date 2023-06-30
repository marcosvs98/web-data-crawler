const { DateTime } = require('luxon');
const {capitalizeString} = require('../utils/utils');
const AbstractHandler = require('../handlers/handlers');

class DateFilterHandler extends AbstractHandler {
  filter(value) {
    if (value.toString().length > 10) {
      value = parseInt(value.toString().slice(0, -3));
    }

    const dateString = DateTime.fromMillis(parseInt(value) * 1000).setZone('America/Sao_Paulo');
    return dateString.toFormat('dd/MM/yyyy HH:mm');
  }
}

class DecimalFilterHandler extends AbstractHandler {
  filter(value) {
    return parseFloat(value);
  }
}

class JSONStringDecoderHandler extends AbstractHandler {
  filter(value) {
    return capitalizeString(value);
  }
}

module.exports = {
  DateFilterHandler,
  DecimalFilterHandler,
  JSONStringDecoderHandler,
};

