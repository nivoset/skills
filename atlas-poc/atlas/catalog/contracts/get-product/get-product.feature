Feature: Get Product

  Scenario: Product exists
    Given a product with id "prod_pro_monthly" exists and is active
    When it is requested by id
    Then the current name, price, and plan tier are returned

  Scenario: Product does not exist
    Given no product with id "prod_ghost" exists
    When it is requested by id
    Then a "not_found" error is returned
