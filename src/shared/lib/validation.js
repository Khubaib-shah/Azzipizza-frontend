/**
 * Basic validation utility.
 * Focuses on accuracy and reuse without external dependencies.
 */

/**
 * Validates a required string.
 * @param {string} value - The string to validate.
 * @returns {boolean} - True if value is not empty.
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

/**
 * Validates a numeric value within a range.
 * @param {number|string} value - The value to validate.
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {boolean} - True if value is a number within the range.
 */
export const validateNumericRange = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Validates an email address.
 * @param {string} email - The email to validate.
 * @returns {boolean} - True if valid email.
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates menu item common fields.
 * Used across the application to keep logic consistent.
 */
export const validateMenuItem = (data) => {
  const errors = {};

  if (!validateRequired(data.name)) {
    errors.name = "A masterpiece needs a deserving name.";
  }

  if (!validateNumericRange(data.price, 0.01)) {
    errors.price = "A culinary delight must have a valid price.";
  }

  if (data.discount && !validateNumericRange(data.discount, 0, 100)) {
    errors.discount = "Discount must be between 0 and 100%.";
  }

  if (!validateRequired(data.category)) {
    errors.category = "Please select a category.";
  }

  if (!validateRequired(data.description)) {
    errors.description = "A short story of the taste is required.";
  }



  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
