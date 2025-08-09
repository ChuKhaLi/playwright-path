// 1. **Builder Pattern**: Create a 'TestRunConfigBuilder' for an object with properties like 'browser', 'headless', 'slowMo', 'screenshotOnFailure'.
interface TestRunConfig {
  browser: 'chrome' | 'firefox' | 'webkit';
  headless: boolean;
  slowMo: number;
  screenshotOnFailure: boolean;
}

class TestRunConfigBuilder {
  private config: Partial<TestRunConfig> = {};

  withBrowser(browser: TestRunConfig['browser']): this {
    this.config.browser = browser;
    return this;
  }

  setHeadless(headless: boolean): this {
    this.config.headless = headless;
    return this;
  }

  withSlowMo(ms: number): this {
    this.config.slowMo = ms;
    return this;
  }

  takeScreenshotOnFailure(value: boolean): this {
    this.config.screenshotOnFailure = value;
    return this;
  }

  build(): TestRunConfig {
    const defaults: TestRunConfig = {
      browser: 'chrome',
      headless: true,
      slowMo: 0,
      screenshotOnFailure: true,
    };
    return { ...defaults, ...this.config };
  }
}

// 2. **Factory Pattern**: Create a 'DriverFactory' that returns different mock "driver" objects ('chromeDriver', 'firefoxDriver') based on a string input.
interface WebDriver {
  start(): void;
  stop(): void;
}

class ChromeDriver implements WebDriver {
  start() { console.log("Starting Chrome Driver"); }
  stop() { console.log("Stopping Chrome Driver"); }
}

class FirefoxDriver implements WebDriver {
  start() { console.log("Starting Firefox Driver"); }
  stop() { console.log("Stopping Firefox Driver"); }
}

class DriverFactory {
  static getDriver(browserName: 'chrome' | 'firefox'): WebDriver {
    if (browserName === 'firefox') {
      return new FirefoxDriver();
    }
    return new ChromeDriver();
  }
}

// 3. **Singleton Pattern**: Create a 'Logger' class that is a singleton and provides 'log' and 'error' methods.
class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }

  error(message: string) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  }
}

// --- Usage Examples ---
console.log("--- Builder Pattern ---");
const config = new TestRunConfigBuilder()
  .withBrowser('firefox')
  .setHeadless(false)
  .build();
console.log(config);

console.log("\n--- Factory Pattern ---");
const chrome = DriverFactory.getDriver('chrome');
chrome.start();

console.log("\n--- Singleton Pattern ---");
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
logger1.log("This is the first message.");
logger2.error("This is an error from the same logger instance.");
console.log("Are loggers the same instance?", logger1 === logger2);