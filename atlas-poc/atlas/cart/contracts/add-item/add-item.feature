Feature: Add Item

  Scenario: Product is in stock
    Given a shopper has an open cart
    And product "prod_pro_monthly" is active
    When they add "prod_pro_monthly" to the cart
    Then the cart contains one line item for "prod_pro_monthly"
    And the line item price matches the product's current price

  # Refinement note: pricing edge cases aren't scripted yet — what happens
  # if the price changes between page load and add-to-cart?
