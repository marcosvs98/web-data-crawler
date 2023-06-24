const { EventEmitter } = require('events');

class AsyncEventHandlerAdapterInterface {
  async start() {
    throw new Error('Method not implemented.');
  }

  async stop() {
    throw new Error('Method not implemented.');
  }

  async __aenter__(kwargs) {
    await this.start();
    return this;
  }

  async __aexit__(exc_type, exc_val, exc_tb) {
    if (exc_val) {
      console.warning(`exc_type: ${exc_type}`);
      console.warning(`exc_value: ${exc_val}`);
      console.warning(`exc_traceback: ${exc_tb}`);
    }
    await this.stop();
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
