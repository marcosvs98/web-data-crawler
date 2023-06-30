import abc


class AbstractHandler(abc.ABC):
    _next_handler: 'AbstractHandler' = None

    def set_next(self, handler: 'AbstractHandler') -> 'AbstractHandler':
        self._next_handler = handler
        return handler

    @abc.abstractmethod
    def filter(self, value: str) -> str:
        raise NotImplementedError
