const ContentParser = require('./content-parser');
const {
  EndTokenNotFoundParserException,
  ParserException,
  StartTokenNotFoundParserException,
  TagNotFoundParserException,
  TeamCatalogParserException,
} = require('../exceptions/exceptions');
const { Match } = require('../schemas/dtos');


class TeamLeagueContentParser extends ContentParser {
  parse() {
    try {
      this.content = this.staticTextParser.parse('LEAGUE').value();
    } catch (ex) {
      console.log('Error occurred during parsing of the team catalog.')
      throw new TeamCatalogParserException(ex?.message);
    }

    const matches = [];
    let foundMatch = true;

    let parameter_name = null;

    while (foundMatch) {
      const data = {};

      for (const parameter of this.template.parameters) {
        try {
          const value = this.sequentialTextParser.parse(parameter.name).value({
            uppercase: true,
            chainFilter: this.filters[parameter.name],
          });
          parameter_name = parameter.name;

          try {
            data[parameter.name.toLowerCase()] = value;
          } catch (error) {
            console.log('ERROR:', error)
            continue;
          }
        } catch (ex) {
          if (
            ex instanceof StartTokenNotFoundParserException ||
            ex instanceof EndTokenNotFoundParserException ||
            ex instanceof TagNotFoundParserException
          ) {
            foundMatch = false;
            break;
          } else {
            console.log(ex.message);
            throw new ParserException(ex.message);
          }
        }
      }

      if (data && foundMatch) {
        const match = new Match(data);
        matches.push(match);
      }
    }
    return matches;
  }
}

module.exports = {TeamLeagueContentParser};