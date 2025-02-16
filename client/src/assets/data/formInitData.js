//product
export const initData = {
  title: "",
  description: "",
  images: [],
  stock: 1,
  categories: [],
  sizes: [],
  colors: [],
  onSale: "false",
  price_before_sale: 0,
  discountPercentage: 0,
};

//service
export const serviceInitFormData = {
  tmCode: "",
  tmName: "",
  tmDescription: "",
  carrierName: "",
  regions: [
    {
      postalCode: 0,
      commune: "",
      wilaya: "",
    },
  ],
};

export const shippingZoneInitFormData = {
  shippingZoneName: "",
  carrierName: "",
  address: "",
  serviceType: "",
  deliveryFee: 0,
  regions: [],
};
