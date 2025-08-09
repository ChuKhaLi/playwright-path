# Project: Advanced API Test Suite

## Objective

Build a comprehensive API test suite that demonstrates advanced testing techniques, including authentication fixtures, schema validation, and mocking.

## Scenario

You are building a test suite for a fictional "Product Management" API. This API has endpoints for managing products and requires authentication.

## Core Tasks

1.  **Project Setup:**
    -   Initialize a new Node.js project (`npm init -y`).
    -   Install Playwright and other dependencies (`npm install -D @playwright/test zod`).
    -   Configure your `playwright.config.ts`.

2.  **Authentication Fixture:**
    -   Create an `auth-helper.ts` file.
    -   Build an `authenticatedApi` fixture that logs into the `DummyJSON` API and provides a pre-configured `APIRequestContext` with the correct `Authorization` header.

3.  **Schema Definitions:**
    -   Create a `schemas.ts` file.
    -   Using `zod`, define a schema for a `Product`. You can find the product structure at `https://dummyjson.com/products/1`.

4.  **Product API Tests (`products.spec.ts`):**
    -   Write a test to fetch a single product and validate its response against your `productSchema`.
    -   Write a test to fetch all products and validate that the response is an array of objects matching the product schema.
    -   Write a test to create a new product using a `POST` request to `/products/add`.
    -   Write a test to update a product using a `PUT` request to `/products/1`.

5.  **UI Mocking Test (`product-ui.spec.ts`):**
    -   Create a test that mocks the `/products` API endpoint.
    -   Use `page.route()` to fulfill the request with a custom array of 2-3 mock products.
    -   Navigate to a test page (you can create a simple local HTML file for this) that would normally display these products.
    -   Assert that your mock product names are visible on the page.

## To Run This Project

```bash
# Install dependencies
npm install

# Run the Playwright tests
npx playwright test