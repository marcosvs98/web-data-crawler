import abc


class TextParser(abc.ABC):
    def __init__(self):
        self.parameters = None
        self.content = ''
        self.reset()

    def set_content(self, content):
        self.content = content
        self.reset()

    def _filter(self, value, chain_filter=None):
        if chain_filter and value:
            value = chain_filter.filter(value)
        return value

    def reset(self):
        self.content_upper = str(self.content.upper())
        self.cursor = str(self.content)
        self.cursor_upper = str(self.content_upper)
        self.field = None
        self.field_upper = None

    def value(self, uppercase=False, chain_filter=None):
        filtered = self._filter(self.field, chain_filter)
        if uppercase and isinstance(filtered, str):
            return filtered.upper()
        return filtered

    @abc.abstractmethod
    def parse(self, tag_name):
        pass
