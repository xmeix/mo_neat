export const userFormInputs = [
  {
    label: "Email",
    name: "email",
    placeholder: "Enter your email",
    type: "email",
    value: "",
  },
  {
    label: "Password",
    name: "password",
    placeholder: "Enter your password",
    type: "password",
    value: "",
  },
  {
    label: "Name",
    name: "name",
    placeholder: "Enter your name",
    type: "text",
    value: "",
  },
  {
    label: "Phone",
    name: "phone",
    placeholder: "Enter your phone number",
    type: "tel",
    value: "",
  },
  {
    label: "Phone",
    name: "phone",
    placeholder: "Enter your phone number",
    type: "tel",
    value: "",
  },
  {
    label: "Role",
    name: "role",
    placeholder: "Select your role",
    type: "select",
    options: [
      { label: "Regular", value: "REGULAR" },
      { label: "Admin", value: "ADMIN" },
    ],
  },
];

export const serviceFormInputs = [
  {
    title: "Service Details",
    children: [
      {
        label: "Name",
        name: "tmName",
        placeholder: "Enter the delivery method name",
        type: "text",
        value: "",
      },
      {
        label: "Code",
        name: "tmCode",
        placeholder: "Enter the delivery method code (must be unique)",
        type: "text",
        value: "",
      },
      {
        label: "Description",
        name: "tmDescription",
        placeholder: "Enter the delivery method code",
        type: "text",
        value: "",
      },
    ],
  },
  {
    title: "Carrier Details",
    children: [
      {
        label: "Carrier Name",
        name: "carrierName",
        placeholder: "Enter the carrier name",
        type: "text",
        value: "",
      },
    ],
  },
];
export const zoneFormInputs = [
  {
    title: "Basic Information",
    children: [
      {
        label: "Shipping Zone Name",
        name: "shippingZoneName",
        placeholder: "Enter the shipping zone name",
        type: "text",
        value: "",
      },
      {
        label: "Carrier Name",
        name: "carrierName",
        placeholder: "Enter the carrier name",
        type: "text",
        value: "",
      },
    ],
  },
  {
    title: "Address Information",
    children: [
      {
        label: "Address",
        name: "address",
        placeholder: "Enter the delivery address",
        type: "text",
        value: "",
      },
      {
        label: "Postal Code",
        name: "postalCode",
        placeholder: "Enter the postal code",
        type: "number",
        value: "",
      },
    ],
  },
  {
    title: "Service Information",
    children: [
      {
        label: "Service Type",
        name: "serviceType",
        placeholder: "Enter the service type",
        type: "text",
        value: "",
      },
      {
        label: "Delivery Fee",
        name: "deliveryFee",
        placeholder: "Enter the delivery fee",
        type: "number",
        value: "",
      },
    ],
  },
  {
    title: "Regions Coverage",
    children: [
      {
        name: "regions",
        label: "Regions",
        type: "inputRow",
        value: [{ postalCode: "", commune: "", wilaya: "" }],
        placeholder: "Enter the regions",
        children: [
          {
            name: "postalCode",
            label: "Postal Code",
            type: "number",
            placeholder: "Postal Code",
            value: "",
          },
          {
            name: "wilaya",
            label: "Wilaya",
            type: "text",
            placeholder: "Wilaya",
            value: "",
          },
          {
            name: "commune",
            label: "Commune",
            type: "text",
            placeholder: "Commune",
            value: "",
          },
        ],
      },
    ],
  },
];

export const productFormInputs = [
  {
    title: "Basic Information",
    children: [
      {
        label: "Title",
        name: "title",
        placeholder: "Enter the product title",
        type: "text",
        value: "",
      },
      {
        label: "Description",
        name: "description",
        placeholder: "Enter the product description",
        type: "textarea",
        value: "",
      },
    ],
  },
  {
    title: "Pricing",
    children: [
      {
        label: "Price",
        name: "price_before_sale",
        placeholder: "Enter the original price",
        type: "number",
        value: "",
      },
      {
        label: "On Sale",
        name: "onSale",
        placeholder: "Is the product on sale?",
        type: "select",
        options: [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        value: "",
        isMulti: false,
        creatable: false,
        children: [
          {
            label: "Discount Percentage",
            name: "discountPercentage",
            placeholder: "Enter the discount percentage",
            type: "number",
            value: "",
          },
        ],
      },
    ],
  },
  {
    title: "Stock Management",
    children: [
      {
        label: "Stock",
        name: "stock",
        placeholder: "Enter the stock quantity",
        type: "number",
        value: "",
      },
    ],
  },
  {
    title: "Product Attributes",
    children: [
      {
        label: "Sizes",
        name: "sizes",
        placeholder: "Select the product sizes",
        type: "select",
        options: [
          { label: "37", value: "37" },
          { label: "XL", value: "XL" },
          { label: "M", value: "M" },
        ],
        isMulti: true,
        value: "",
        creatable: true,
      },
      {
        label: "Colors",
        name: "colors",
        placeholder: "Select the product colors",
        type: "select",
        options: [
          { value: "#ff0000", label: "Red" },
          { value: "#00ff00", label: "Green" },
          { value: "#0000ff", label: "Blue" },
        ],
        isMulti: true,
        value: "",
        creatable: true,
        isColor: true,
      },
      {
        label: "Categories",
        name: "categories",
        placeholder: "Select the product category",
        type: "select",
        options: [
          { label: "Electronics", value: "ELECTRONICS" },
          { label: "Fashion", value: "FASHION" },
          { label: "Home & Garden", value: "HOME_GARDEN" },
          { label: "Health & Beauty", value: "HEALTH_BEAUTY" },
          { label: "Sports & Outdoors", value: "SPORTS_OUTDOORS" },
        ],
        isMulti: true,
        value: "",
        creatable: true,
      },
    ],
  },
  {
    title: "Media",
    children: [
      {
        label: "Images",
        name: "images",
        placeholder: "Upload all images",
        type: "file",
        value: "",
      },
    ],
  },
];

export const couponFormInputs = [
  {
    title: "Coupon Details",
    children: [
      {
        label: "Coupon Name",
        name: "name",
        placeholder: "Enter the coupon name",
        type: "text",
        value: "",
      },
      {
        label: "Coupon Code",
        name: "code",
        placeholder: "Enter the coupon code",
        type: "text",
        value: "",
      },
    ],
  },
  {
    title: "Discount Information",
    children: [
      {
        label: "Discount Percentage",
        name: "discountPercentage",
        placeholder: "Enter the discount percentage",
        type: "number",
        value: "",
      },
      {
        label: "Description",
        name: "description",
        placeholder: "Enter the coupon description",
        type: "textarea",
        value: "",
      },
    ],
  },
  {
    title: "Validity Period",
    children: [
      {
        label: "Expiry Date",
        name: "expiryDate",
        placeholder: "Enter the expiry date (YYYY-MM-DD)",
        type: "date",
        value: "",
      },
    ],
  },
];

export const wilayaFormInputs = [
  {
    label: "Name",
    name: "name",
    placeholder: "Enter the Wilaya name",
    type: "text",
    value: "",
  },
  {
    label: "Centers",
    name: "communes",
    placeholder: "Select the Centers",
    type: "select",
    options: [],
    isMulti: true,
    value: "",
    creatable: true,
  },
  {
    label: "Home Delivery Fee",
    name: "homeDeliveryFee",
    placeholder: "Enter the home delivery fee",
    type: "number",
    value: "",
  },
];
export const centerFormInputs = [
  {
    label: "Name",
    name: "name",
    placeholder: "Enter the Center name",
    type: "text",
    value: "",
  },
  {
    label: "Wilaya",
    name: "wilaya",
    placeholder: "Select the Wilaya",
    type: "select",
    options: [],
    isMulti: false,
    value: "",
    creatable: true,
  },
];
export const algerianProvinces = [
  { province: "Adrar", postalCode: "01000" },
  { province: "Chlef", postalCode: "02000" },
  { province: "Laghouat", postalCode: "03000" },
  { province: "Oum El Bouaghi", postalCode: "04000" },
  { province: "Batna", postalCode: "05000" },
  { province: "Biskra", postalCode: "06000" },
  { province: "Béjaïa", postalCode: "06000" },
  { province: "Tamanrasset", postalCode: "11000" },
  { province: "Tipaza", postalCode: "42000" },
  { province: "Tissemsilt", postalCode: "38000" },
  { province: "Khenchela", postalCode: "40000" },
  { province: "Souk Ahras", postalCode: "41000" },
  { province: "El Oued", postalCode: "39000" },
  { province: "Annaba", postalCode: "23000" },
  { province: "El Tarf", postalCode: "36000" },
  { province: "Tebessa", postalCode: "12000" },
  { province: "Sétif", postalCode: "19000" },
  { province: "Saida", postalCode: "20000" },
  { province: "Djelfa", postalCode: "17000" },
  { province: "Skikda", postalCode: "21000" },
  { province: "Jijel", postalCode: "18000" },
  { province: "M’sila", postalCode: "28000" },
  { province: "Mascara", postalCode: "29000" },
  { province: "Ain Defla", postalCode: "14000" },
  { province: "Naama", postalCode: "45000" },
  { province: "Ain Témouchent", postalCode: "46000" },
  { province: "Oran", postalCode: "31000" },
  { province: "El Bayadh", postalCode: "32000" },
  { province: "Bechar", postalCode: "08000" },
  { province: "Tindouf", postalCode: "12000" },
  { province: "Ghardaïa", postalCode: "47000" },
  { province: "Illizi", postalCode: "35000" },
  { province: "Bordj Bou Arreridj", postalCode: "34000" },
  { province: "Bouira", postalCode: "10000" },
  { province: "Boumerdès", postalCode: "35000" },
  { province: "Tizi Ouzou", postalCode: "15000" },
  { province: "Algiers", postalCode: "16000" },
];
