import { useState } from "react";
import "./AdminProducts.scss";
import { useSelector } from "react-redux";
import AdminForm from "../../components/AdminForm/AdminForm";
import { productFormInputs } from "../../../../assets/data/formsData"; // Update this accordingly
import Table from "../../../../components/table/Table";
import useDrawer from "../../../../utils/hooks/drawer/useDrawer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useToast from "../../../../utils/hooks/toast/useToast";
import { isValidProduct } from "../../../../utils/functions";
const data = {
  title: "",
  description: "",
  images: [],
  stock: 1,
  categories: [],
  sizes: [],
  colors: [],
  onSale: false,
  price_before_sale: 0,
  discountPercentage: 0,
};

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Description", accessor: "description" },
  { header: "Price - DA", accessor: "price_before_sale" },
  { header: "Discount - %", accessor: "discountPercentage" },
  { header: "Stock", accessor: "stock" },
  { header: "On Sale", accessor: "onSale" },
  { header: "image", accessor: "img" },
  { header: "created at", accessor: "createdAt" },
  { header: "updated at", accessor: "updatedAt" },
];
const AdminProducts = () => {
  const { Drawer, showDrawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast } = useToast();

  // const products = [];
  const { products, loading, error, success } = useSelector(
    (state) => state.product
  );
  // const products = [
  //   {
  //     id: 1,
  //     title: "Product 1",
  //     description: "High-quality leather bag",
  //     price_before_sale: 100,
  //     discountPercentage: 10,
  //     stock: 20,
  //     onSale: false,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     img: ["/dress.png"],
  //   },
  //   {
  //     id: 2,
  //     title: "Product 2",
  //     description: "Premium running shoes",
  //     price_before_sale: 150,
  //     discountPercentage: 15,
  //     stock: 15,
  //     onSale: true,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     img: ["/dress.png"],
  //   },
  //   {
  //     id: 3,
  //     title: "Product 3",
  //     description: "Wireless Bluetooth headphones",
  //     price_before_sale: 80,
  //     discountPercentage: 5,
  //     stock: 30,
  //     onSale: false,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     img: ["/dress.png"],
  //   },
  //   {
  //     id: 4,
  //     title: "Product 4",
  //     description: "Stylish wristwatch with leather strap",
  //     price_before_sale: 120,
  //     discountPercentage: 20,
  //     stock: 10,
  //     onSale: true,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     img: ["/dress.png"],
  //   },
  //   {
  //     id: 5,
  //     title: "Product 5",
  //     description: "4K UHD Smart TV",
  //     price_before_sale: 600,
  //     discountPercentage: 25,
  //     stock: 5,
  //     onSale: true,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     img: ["/dress.png"],
  //   },
  //   // Continue adding createdAt and updatedAt for each product...
  // ];

  const actions = [
    {
      label: "View Product",
      icon: VisibilityIcon,
      iconColor: "#00BFA6", // Teal
      onClick: (row) => {
        console.log("View Product", row);
      },
    },
    {
      label: "Edit Product",
      icon: EditIcon,
      iconColor: "#FFC400", // Golden Yellow
      onClick: (row) => {
        console.log("Edit Product", row);
      },
    },
    {
      special: true,
      label: "Delete Product",
      icon: DeleteIcon,
      iconColor: "#FF5252", // Bright Coral Red
      onClick: (row) => {
        console.log("Delete Product", row);
      },
    },
  ];

  const onCreate = () => {
    setShowDrawer(true);
  };
  const handleCreate = (formData) => {
    console.log(formData);
    console.log("creating...");

    if (isValidProduct(formData)) {
      console.log("is Valid");
    } else console.log("isnt valid");
  };

  return (
    <div className="admin-products">
      <Table
        columns={columns}
        data={products}
        actions={actions}
        rowsPerPage={5}
        title="Product Management"
        unit="products"
        cardHeaders={["title", "description"]}
        banned={[
          ["id", "img"],
          ["description", "img", "createdAt", "updatedAt"],
        ]}
        footer={["createdAt", "updatedAt"]}
        onCreate={onCreate}
      />
      {showDrawer && (
        <Drawer title="Add Product">
          <AdminForm
            data={data}
            formInputs={productFormInputs}
            handleCreate={handleCreate}
          />
        </Drawer>
      )}
    </div>
  );
};

export default AdminProducts;
