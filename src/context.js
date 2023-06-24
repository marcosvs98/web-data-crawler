const { EventEmitter } = require('events');

class AsyncEventHandlerAdapterInterface {
  async start() {
    throw new Error('Method not implemented.');
  }

  async stop() {
    throw new Error('Method not implemented.');
  }
}

class AsyncEventHandlerThreadedAdapter extends AsyncEventHandlerAdapterInterface {
  constructor() {
    super();
    this.thread = null;
    this.thread_name = this.constructor.name;
    this.thread_running = false;
  }

  async handle_event() {
    throw new Error('Method not implemented.');
  }

  async delay(interval) {
    const t0 = Date.now();
    while (this.thread_running && t0 + interval > Date.now()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return this.thread_running;
  }

  async start() {
    if (!this.thread) {
      this.thread = (async () => {
        try {
          await this.handle_event();
        } catch (error) {
          console.error(error);
        }
      })();
      this.thread_running = true;
    }
  }

  async stop() {
    if (this.thread) {
      this.thread_running = false;
      this.thread = null;
    }
  }
}


class AsyncCrawlerHandlerLifecycle extends AsyncEventHandlerThreadedAdapter {
  constructor(thread_handler) {
    super();
    this.thread_handler = thread_handler;
  }

  async handle_event() {
    let running = true;
    while (running) {
      await this.thread_handler();
      await this.delay(1000 * 2);
    }
  }
}

module.exports = {AsyncCrawlerHandlerLifecycle};