import abc
import asyncio
import logging
import time

logger = logging.getLogger(__name__)


class AsyncEventHandlerAdapterInterface(abc.ABC):
    @abc.abstractmethod
    async def start(self) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    async def stop(self) -> None:
        raise NotImplementedError

    async def __aenter__(self, **kwargs):
        await self.start()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_val:
            logger.warning(f'exc_type: {exc_type}')
            logger.warning(f'exc_value: {exc_val}')
            logger.warning(f'exc_traceback: {exc_tb}')
        await self.stop()


class AsyncEventHandlerThreadedAdapter(AsyncEventHandlerAdapterInterface):
    def __init__(self):
        self.thread = None
        self.thread_name = type(self)
        self.thread_running = False

    @abc.abstractmethod
    async def handle_event(self) -> None:
        raise NotImplementedError

    async def delay(self, interval: int) -> None:
        t0 = time.time()
        while self.thread_running and (t0 + interval > time.time()):
            await asyncio.sleep(1)
        return self.thread_running

    async def start(self):
        if not self.thread:
            self.thread = asyncio.create_task(self.handle_event())
            self.thread_running = True

    async def stop(self):
        if self.thread:
            # await self.before_stop()
            self.thread_running = False
            self.thread.cancel()
            try:
                await self.thread
            except asyncio.CancelledError:
                pass
            self.thread = None
