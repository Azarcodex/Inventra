export const MESSAGES = {
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_FETCHED: "Products fetched successfully",
  PRODUCT_NOT_FOUND: "Product not found",

  VALIDATION_ERROR: "Validation failed",
  SERVER_ERROR: "Something went wrong",

  STOCK_MOVEMENT_CREATED: "Stock movement recorded successfully",
  INSUFFICIENT_STOCK: "Insufficient stock",
  INVALID_QUANTITY: "Quantity must be greater than 0",
  INVALID_MOVEMENT_TYPE: "Invalid movement type",
  NEGATIVE_STOCK: "Stock cannot go negative",
  PRODUCT_ID_REQUIRED: "Product ID is required",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product permanently deleted",
  PRODUCT_SOFT_DELETED: "Product moved to archive",
  INVALID_INPUT: "Invalid input",
  HISTORY_LOAD_ERROR: "Failed to load movement history",
  NO_HISTORY_FOUND: "No movements recorded yet for this product",
} as const;
