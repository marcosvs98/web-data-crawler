import logging

from content_parser.content_parser import ContentParser
from exceptions.parser_exceptions import (
    EndTokenNotFoundParserException,
    ParserException,
    StartTokenNotFoundParserException,
    TagNotFoundParserException,
    TeamCatalogParserException,
)
from schemas.dtos import Match

logger = logging.getLogger(__name__)


class TeamLeagueContentParser(ContentParser):
    """Content parser for team league information.

    This class extends the ContentParser abstract base class and provides specific parsing logic
    for extracting team league information from the content."""

    def parse(self):
        try:
            self.content = self.text_parser_static.parse('LEAGUE').value()
        except ParserException as ex:
            logger.error('Error occurred during parsing of the team catalog.')
            raise TeamCatalogParserException from ex

        matches = []

        found_match = True

        while found_match:
            match = Match.construct()

            for parameter in self.template.parameters:
                try:
                    value = self.text_parser_sequential.parse(parameter.name).value(
                        chain_filter=self.filters.get(parameter.name)
                    )
                    try:
                        setattr(match, parameter.name.lower(), value)
                    except (ValueError, AttributeError):
                        continue
                except (
                    StartTokenNotFoundParserException,
                    EndTokenNotFoundParserException,
                    TagNotFoundParserException,
                ):
                    logger.warning('No more matching results in recursive search')
                    found_match = False
                    break

            if match and found_match:
                logger.info(f'Valid match found: {match.home_team}')
                matches.append(match)

        logger.info(f'Returning {len(matches)} valid matches')
        return matches
