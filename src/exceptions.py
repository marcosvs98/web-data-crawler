class ParserException(Exception):
    """Generic exception raised during the content parsing process."""


class InvalidTagParserException(ParserException):
    """Exception raised when an invalid parsing tag is encountered."""


class StartTokenNotFoundParserException(ParserException):
    """Exception raised when the start token is not found during parsing."""


class EndTokenNotFoundParserException(ParserException):
    """Exception raised when the end token is not found during parsing."""


class TagNotFoundParserException(ParserException):
    """Exception raised when a specific tag is not found during parsing."""


class TeamCatalogParserException(ParserException):
    """Exception raised during the parsing of the team catalog."""
