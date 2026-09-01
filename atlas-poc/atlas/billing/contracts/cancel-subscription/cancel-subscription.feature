Feature: Cancel Subscription

  Scenario: Customer cancels at period end
    Given an active subscription
    When the customer cancels with "at period end" selected
    Then the subscription is marked to cancel at the current period end
    And the customer keeps access until then

  # Refinement note: proration for immediate cancellation isn't agreed yet —
  # full refund, prorated refund, or no refund? Needs a decision before this
  # can move to "solid".
