import abc

from text_parser.text_parser import TextParser


class ContentParser(abc.ABC):
    def __init__(
        self,
        template,
        content: str,
        filters: dict = {},
        text_parser_static: TextParser = None,
        text_parser_sequential: TextParser = None,
    ):
        self.template = template
        self._content = str(content)
        self.filters = filters

        self.content_upper = str(content.upper())
        text_parser_static.set_content(self._content)
        text_parser_static.reset()
        text_parser_static.parameters = self.template.parameters
        text_parser_static.content_parser = self
        self.text_parser_static = text_parser_static

        text_parser_sequential.set_content(self._content)
        text_parser_sequential.reset()
        text_parser_sequential.parameters = self.template.parameters
        text_parser_sequential.content_parser = self
        self.text_parser_sequential = text_parser_sequential

    @property
    def content(self):
        return self._content

    @content.setter
    def content(self, value):
        self._content = str(value)
        if hasattr(self, 'text_parser_static'):
            self.text_parser_static.set_content(self._content)
        if hasattr(self, 'text_parser_sequential'):
            self.text_parser_sequential.set_content(self._content)

    @abc.abstractmethod
    async def parse(self):
        raise NotImplementedError
