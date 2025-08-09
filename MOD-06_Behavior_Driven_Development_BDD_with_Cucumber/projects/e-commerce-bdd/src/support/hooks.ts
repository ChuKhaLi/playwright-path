import { Before, After, BeforeAll, AfterAll, ITestCaseHookParameter, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import { CustomWorld } from "./world";

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false });
});

Before(async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {
  const context = await browser.newContext();
  const page = await context.newPage();
  this.page = page;
  this.context = context;
});

After(async function (this: CustomWorld, { pickle, result }: ITestCaseHookParameter) {
  if (result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ path: `reports/screenshots/${pickle.name}.png`, fullPage: true });
    this.attach(screenshot, "image/png");
  }
  await this.page.close();
  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
});