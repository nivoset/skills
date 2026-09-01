Feature: Send Email

  Scenario: Welcome email after a subscription starts
    Given a subscription was just created for a customer
    When the "welcome" template is requested for that customer
    Then an email is sent to the customer's verified address
    And the send is recorded against the subscription id

  # Refinement note: retry/backoff behavior on provider failure isn't
  # scripted yet.
