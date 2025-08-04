# Lesson 6: Test Reporting and Notifications - Exercises

## Exercise 1: Configure Multiple Reporters

1. **Open your `playwright.config.ts` file.**
2. **Configure the `html` and `junit` reporters to run simultaneously.**
3. **Run your tests and verify that both an HTML report and a `results.xml` file are generated.**

## Exercise 2: Set Up Slack Notifications

1. **Create a Slack App and a webhook URL.**
2. **Store the webhook URL as a secret in your GitHub repository.**
3. **Add a step to your GitHub Actions workflow to send a notification to Slack on test failure.**
4. **You can use a community action like `slackapi/slack-github-action` to send the notification.**
5. **Intentionally make a test fail and run the workflow to verify that you receive a Slack notification.**