/**
 * Utility for sanitizing input data.
 * Focuses on string cleaning and data normalization.
 */

/**
 * Normalizes strings by trimming and removing extra spaces.
 * @param {string} value - The input value.
 * @returns {string} - Cleaned string.
 */
export const sanitizeString = (value) => {
  if (typeof value !== "string") return value;
  return value.trim().replace(/\s+/g, " ");
};

/**
 * Sanitizes a numeric input.
 * @param {number|string} value - The input value.
 * @param {number} precision - Decimal places.
 * @returns {number} - Cleaned number.
 */
export const sanitizeNumeric = (value, precision = 2) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Number(num.toFixed(precision));
};

/**
 * Sanitizes an absolute discount.
 * @param {number|string} value - The discount value.
 * @returns {number} - Normalized discount.
 */
export const sanitizeDiscount = (value) => {
  const discount = sanitizeNumeric(value);
  if (discount < 0) return 0;
  if (discount > 100) return 100;
  return discount;
};

/**
 * Cleans a menu item data object.
 * @param {object} data - Form data.
 * @returns {object} - Cleaned data for API.
 */
export const sanitizeMenuItem = (data) => {
  return {
    ...data,
    name: sanitizeString(data.name),
    description: sanitizeString(data.description),
    price: sanitizeNumeric(data.price),
    discount: sanitizeDiscount(data.discount),
    category: sanitizeString(data.category).toLowerCase(),
    ingredients: (data.ingredients || []).map((ingredient) => ({
      name: sanitizeString(ingredient.name),
      price: sanitizeNumeric(ingredient.price),
    })),
    showInSpecialOffers: data.showInSpecialOffers === true || data.showInSpecialOffers === "true",
    showInChefsSpecials: data.showInChefsSpecials === true || data.showInChefsSpecials === "true",
    showInWeeklySpecials: data.showInWeeklySpecials === true || data.showInWeeklySpecials === "true",
  };
};
