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

  if (isEmpty([data.price_before_sale]) || data.price_before_sale < 0) {
    errors.price_before_sale = "Price must be a positive number.";
  }

  if (data.onSale === "true" && isEmpty([data.discountPercentage])) {
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

  // Return errors object, empty object means valid product
  return Object.keys(errors).length === 0 ? null : errors;
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
