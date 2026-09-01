Feature: Read Catalog Rows

  Scenario: Catalog service reads active products
    Given the products table contains active and archived rows
    When the catalog service queries for active products
    Then only active rows are returned, ordered by name

  Scenario: Catalog service reads a single product by id
    Given a product row exists for a given id
    When the catalog service queries by that id
    Then the matching row is returned with its current price
