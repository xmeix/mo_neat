export const isValidHex = (hex) => {
  const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
  return hexRegex.test(hex);
};
export const isValidProduct = (product) => {
  const {
    title,
    description,
    price_before_sale,
    images,
    onSale,
    sizes,
    stock,
    categories,
    discountPercentage,
  } = product;

  if (
    isEmpty([
      title,
      description,
      price_before_sale,
      images,
      onSale,
      sizes,
      stock,
      categories,
    ])
  ) {
    return false;
  }

  if (onSale === "true" && isEmpty([discountPercentage])) return false;

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
