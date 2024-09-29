export const isValidHex = (hex) => {
  const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
  return hexRegex.test(hex);
};
export const isValidProduct = (data) => {
  const errors = {};

  if (isEmpty([data.title]) || data.title.trim() === "") {
    errors.title = "Title is required.";
  }

  if (isEmpty([data.description]) || data.description.trim() === "") {
    errors.description = "Description is required.";
  }

  if (isEmpty([data.price_before_sale]) || data.price_before_sale <= 0) {
    errors.price_before_sale =
      "Price must be a positive number and superior to 0";
  }

  if (
    (data.onSale === "true" && isEmpty([data.discountPercentage])) ||
    (data.onSale === "true" && data.discountPercentage > 100) ||
    (data.onSale === "true" && data.discountPercentage <= 0)
  ) {
    errors.discountPercentage =
      "Discount percentage must be between 0 and 100.";
  }

  if (isEmpty([data.stock]) || data.stock < 1) {
    errors.stock = "Stock must be at least 1.";
  }

  // Check for required arrays
  if (!Array.isArray(data.categories) || isEmpty([data.categories])) {
    errors.categories = "At least one category is required.";
  }

  if (!Array.isArray(data.sizes) || isEmpty([data.sizes])) {
    errors.sizes = "At least one size is required.";
  }

  if (!Array.isArray(data.colors) || isEmpty([data.colors])) {
    errors.colors = "At least one color is required.";
  } else {
    //check the colors: has to be true
    const isValid = data.colors.every((e, i) => isValidHex(e));
    if (!isValid) {
      errors.colors = "One of the colors isn't correct.";
    }
  }

  // Check for image uploads
  if (!Array.isArray(data.images) || isEmpty([data.images])) {
    errors.images = "At least one image is required.";
  }
  return Object.keys(errors).length === 0 ? null : errors;
};
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};
export const isValidCoupon = (data) => {
  const errors = {};

  if (isEmpty([data.name]) || data.name.trim() === "") {
    errors.name = "Coupon name is required.";
  }

  if (isEmpty([data.code]) || data.code.trim() === "") {
    errors.code = "Coupon code is required.";
  } else {
    data.code = data.code.toUpperCase().trim();

    const isValidCode = /^[A-Z0-9]+$/.test(data.code);
    if (!isValidCode) {
      errors.code = "Coupon code must contain only letters and numbers.";
    }
  }
  if (
    isEmpty([data.discountPercentage]) ||
    data.discountPercentage <= 0 ||
    data.discountPercentage > 100
  ) {
    errors.discountPercentage =
      "Discount percentage must be a positive number between 1 and 100.";
  }

  if (data.description && data.description.trim() === "") {
    errors.description = "Description cannot be empty if provided.";
  }

  if (isEmpty([data.expiryDate]) || !isValidDate(data.expiryDate)) {
    errors.expiryDate = "A valid expiry date is required.";
  } else if (new Date(data.expiryDate) < new Date()) {
    errors.expiryDate = "Expiry date must be in the future.";
  }

  return Object.keys(errors).length === 0 ? null : errors;
};
export const isValidDate = (date) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};
export const isSameProduct = (obj1, obj2) => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !isSameProduct(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export const isEmpty = (array) => {
  if (!Array.isArray(array)) {
    console.log("Expected an array");
  }

  return array.some(
    (e) =>
      e === "" ||
      e === null ||
      e === 0 ||
      e === undefined ||
      (Array.isArray(e) && e.length === 0)
  );
};
export const parseError = (error) => {
  if (!error) return null;

  let parsedObject;

  if (typeof error === "string") {
    try {
      parsedObject = JSON.parse(error);
    } catch (e) {
      console.log("Invalid JSON string:", error);
      return null;
    }
  } else if (typeof error === "object") {
    parsedObject = error;
  } else {
    return null;
  }

  const key = Object.keys(parsedObject)[0];
  const value = parsedObject[key];

  return { key: key, value: value };
};
export const isISODate = (str) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(str);

export const isValidWilaya = (data) => {
  const errors = {};

  if (isEmpty([data.name]) || data.name.trim() === "") {
    errors.name = "Wilaya name is required.";
  }

  // Validate communes
  if (!Array.isArray(data.communes) || isEmpty(data.communes)) {
    errors.communes = "At least one commune is required.";
  } else {
    const areValidCommunes = data.communes.every(
      (commune) => typeof commune === "string" && commune.trim() !== ""
    );
    if (!areValidCommunes) {
      errors.communes = "All communes must be valid non-empty strings.";
    }
  }

  if (isEmpty([data.homeDeliveryFee]) || data.homeDeliveryFee <= 0) {
    errors.homeDeliveryFee = "Home delivery fee must be a non-negative number.";
  }

  return Object.keys(errors).length === 0 ? null : errors;
};
