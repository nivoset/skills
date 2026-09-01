Feature: Charge Card

  Scenario: Charge succeeds against a verified payment method
    Given a verified payment method and an amount to charge
    When the charge is submitted with an idempotency key
    Then the gateway returns a charge id with status "succeeded"

  Scenario: Charge is declined
    Given a payment method that the issuing bank will decline
    When the charge is submitted
    Then the gateway returns status "declined" with a decline reason
