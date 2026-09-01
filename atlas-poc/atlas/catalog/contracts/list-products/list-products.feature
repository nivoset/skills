Feature: List Products

  Scenario: Shopper browses the storefront with no filters
    Given the catalog has active and archived products
    When a shopper requests the product list with no filters
    Then only active products are returned
    And each product includes its name, price, and plan tier

  Scenario: Shopper filters by plan tier
    Given the catalog contains products across the "starter" and "pro" tiers
    When a shopper requests products filtered to the "pro" tier
    Then only "pro" tier products are returned
