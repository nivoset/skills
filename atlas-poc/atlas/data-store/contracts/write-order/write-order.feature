Feature: Write Order Record

  Scenario: Subscription row is persisted after a successful charge
    Given a customer, plan, and successful charge result
    When the order record is written
    Then a subscription row exists with status "active"

  # Refinement note: retry/idempotency behavior when the write times out
  # after the charge already succeeded isn't decided yet.
