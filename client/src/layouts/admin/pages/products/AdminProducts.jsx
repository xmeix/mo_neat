import { useEffect, useState } from "react";
import "./AdminProducts.scss";
import { useDispatch, useSelector } from "react-redux";
import AdminForm from "../../components/AdminForm/AdminForm";
import { productFormInputs } from "../../../../assets/data/formsData"; // Update this accordingly
import Table from "../../../../components/table/Table";
import useDrawer from "../../../../utils/hooks/drawer/useDrawer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useToast from "../../../../utils/hooks/toast/useToast";
import { isValidProduct } from "../../../../utils/functions";
import { addProduct } from "../../../../store/apiCalls/product";
import { resetError, setError } from "../../../../store/slices/productSlice";

const initData = {
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

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Description", accessor: "description" },
  { header: "Price - DA", accessor: "price_before_sale" },
  { header: "Discount - %", accessor: "discountPercentage" },
  { header: "Stock", accessor: "stock" },
  { header: "On Sale", accessor: "onSale" },
  { header: "Images", accessor: "images" },
  { header: "Sizes", accessor: "sizes" },
  { header: "Colors", accessor: "colors" },
  { header: "Categories", accessor: "categories" },
  { header: "Created At", accessor: "createdAt" },
  { header: "Updated At", accessor: "updatedAt" },
];

const AdminProducts = () => {
  const { Drawer, showDrawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast } = useToast();
  const [formData, setFormData] = useState(initData);
  const dispatch = useDispatch();
  const { products, loading, error, success } = useSelector(
    (state) => state.product
  );

  const actions = [
    {
      label: "View Product",
      icon: VisibilityIcon,
      iconColor: "#00BFA6",
      onClick: (row) => {
        console.log("View Product", row);
      },
    },
    {
      label: "Edit Product",
      icon: EditIcon,
      iconColor: "#FFC400",
      onClick: (row) => {
        console.log("Edit Product", row);
      },
    },
    {
      special: true,
      label: "Delete Product",
      icon: DeleteIcon,
      iconColor: "#FF5252",
      onClick: (row) => {
        console.log("Delete Product", row);
      },
    },
  ];

  const onCreate = () => {
    setFormData(initData);
    setShowDrawer(true);
  };

  const handleCreate = async (data, e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("onSale", data.onSale);
    formData.append("discountPercentage", data.discountPercentage);
    formData.append("price_before_sale", data.price_before_sale);
    formData.append("stock", data.stock);

    // Append array values
    data.categories.forEach((category) => {
      formData.append("categories[]", category);
    });

    data.sizes.forEach((size) => {
      formData.append("sizes[]", size);
    });

    data.colors.forEach((color) => {
      formData.append("colors[]", color);
    });

    data.images.forEach((image) => {
      formData.append("images[]", image);
    });
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    try {
      dispatch(addProduct(formData)).unwrap();
      setFormData(data);
      showSuccessToast("Product created successfully");
    } catch (error) {
      setFormData(data);
      console.error("Error creating product:", error);
      // Handle error (e.g., show error toast)
    }
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
          ["id", "images"],
          [
            "description",
            "images",
            "createdAt",
            "updatedAt",
            "sizes",
            "colors",
            "categories",
          ],
        ]}
        footer={["createdAt", "updatedAt"]}
        special={["sizes", "categories", "colors"]}
        onCreate={onCreate}
      />
      {showDrawer && (
        <Drawer title="Add Product">
          <AdminForm
            data={formData}
            formInputs={productFormInputs}
            handleCreate={handleCreate}
            validationMethod={isValidProduct}
          />
        </Drawer>
      )}
    </div>
  );
};

export default AdminProducts;
