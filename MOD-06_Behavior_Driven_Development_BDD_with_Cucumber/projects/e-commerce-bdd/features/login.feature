Feature: User Login

  As a user,
  I want to be able to log in to the application,
  So that I can access my account.

  @smoke
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I log in as a "valid_user"
    Then I should be on the home page

  @regression
  Scenario: Unsuccessful login with invalid credentials
    Given I am on the login page
    When I log in with invalid credentials
    Then I should see an error message