import logging

from exceptions.parser_exceptions import (
    EndTokenNotFoundParserException,
    InvalidTagParserException,
    StartTokenNotFoundParserException,
    TagNotFoundParserException,
)
from text_parser.text_parser import TextParser

logger = logging.getLogger(__name__)


class SequentialTextParser(TextParser):
    """A text parser that sequentially searches for tags and
    extracts content between start and end tokens."""

    def parse(self, tag_name: str, replace_map={}):
        for parameter in self.parameters:
            if parameter.name == tag_name:
                start_tag = parameter.start_tag.upper()
                end_tag = parameter.end_tag.upper()

                for old, new in replace_map.items():
                    if old and (new is not None):
                        start_tag = start_tag.replace(old.upper(), new.upper())
                        end_tag = end_tag.replace(old.upper(), new.upper())

                if not start_tag:
                    logger.warning(f"Error while processing tag: '{tag_name}'.")
                    raise InvalidTagParserException(tag_name)

                start_block, token, end_block = self.cursor_upper.partition(
                    start_tag
                )  # noqa: E0203

                if not token:
                    logger.warning(f"Start token not found for tag: '{tag_name}'.")
                    raise StartTokenNotFoundParserException(tag_name)

                offset = len(start_block + token)

                if end_tag:
                    start_block, token, end_block = end_block.partition(end_tag)

                    if not token:
                        logger.warning(f"End token not found for tag: '{tag_name}'.")
                        raise EndTokenNotFoundParserException(tag_name)

                    self.field_upper = start_block
                    self.cursor_upper = end_block
                else:
                    self.field_upper, token, self.cursor_upper = end_block.partition(start_tag)
                    self.cursor_upper = token + self.cursor_upper

                self.field = self.cursor[offset:][: len(self.field_upper)]
                self.cursor = self.cursor[-len(self.cursor_upper) :]

                return self

        logger.warning(f"Tag '{tag_name}' not found during parsing.")
        raise TagNotFoundParserException(tag_name)
