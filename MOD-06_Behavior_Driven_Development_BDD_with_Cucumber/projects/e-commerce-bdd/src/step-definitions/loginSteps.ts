import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import * as fs from "fs";
import * as path from "path";

const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/users.json"), "utf-8"));

Given("I am on the login page", async function (this: CustomWorld) {
  await this.loginPage.navigate();
});

When("I log in as a {string}", async function (this: CustomWorld, userType: string) {
  const user = users[userType];
  await this.loginPage.login(user.username, user.password);
});

When("I log in with invalid credentials", async function (this: CustomWorld) {
  await this.loginPage.login("invalid_user", "invalid_password");
});

Then("I should be on the home page", async function (this: CustomWorld) {
  await expect(this.homePage.title).toBeVisible();
});

Then("I should see an error message", async function (this: CustomWorld) {
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage).toContain("Epic sadface:");
});