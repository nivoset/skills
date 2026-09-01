Feature: Ingest Domain Event

  Scenario: A well-formed event is accepted
    Given a service sends an event with a type, source, and payload
    When the event is ingested
    Then it is stamped with a trace id and timestamp
    And it is written to the event stream and the structured log store

  Scenario: A malformed event is rejected
    Given a service sends an event missing its required "type" field
    When the event is ingested
    Then it is rejected with a "validation_failed" reason
    And the sender's own attempt is logged for follow-up
