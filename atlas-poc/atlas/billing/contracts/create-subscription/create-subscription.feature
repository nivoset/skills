Feature: Create Subscription

  Scenario: Customer starts a monthly plan with a valid payment method
    Given a customer with a verified payment method
    When they request a "monthly" subscription to the "pro" plan
    Then a subscription is created with status "active"
    And an invoice is generated for the current billing period

  Scenario: Payment method is declined
    Given a customer whose payment method will be declined
    When they request a subscription to any plan
    Then the subscription is not created
    And a "payment_failed" event is emitted

  Scenario: Coupon code reduces the first invoice
    Given a customer with a verified payment method
    And a valid coupon code for 20% off the first period
    When they request a "monthly" subscription to the "starter" plan
    Then a subscription is created with status "active"
    And the first invoice reflects the 20% discount
