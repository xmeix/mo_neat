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
import { isSameProduct, isValidProduct } from "../../../../utils/functions";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "../../../../store/apiCalls/product";
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
  const { Drawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();
  const [formData, setFormData] = useState(initData);
  const [drawerType, setDrawerType] = useState(null);
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
      onClick: (row) => onEdit(row),
    },
    {
      special: true,
      label: "Delete Product",
      icon: DeleteIcon,
      iconColor: "#FF5252",
      onClick: (row) => handleDelete(row.id),
    },
  ];

  const onCreate = () => {
    setFormData(initData);
    setShowDrawer(true);
    setDrawerType("add");
  };

  const handleDelete = async (id) => {
    console.log("Delete Product", id);
    try {
      await dispatch(deleteProduct(id));
      showSuccessToast("Product deleted successfully");
    } catch (ero) {
      console.log("Error creating product:", ero);
      showErrorToast(error || ero);
    }
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
      await dispatch(addProduct(formData)).unwrap();
      showSuccessToast("Product created successfully");
      setShowDrawer(false);
    } catch (ero) {
      setFormData(data);
      console.log("Error creating product:", ero);
      showErrorToast(error || ero);
    }
  };

  const onEdit = (row) => {
    setDrawerType("edit");
    setShowDrawer(true);
    setFormData(row);
  };

  const handleEdit = async (data, e) => {
    e.preventDefault();

    if (isSameProduct(data, formData)) {
      showInfoToast("No changes have been made to the product, yet!");
      return;
    } else {
      const newformData = new FormData();

      newformData.append("id", data.id);
      newformData.append("title", data.title);
      newformData.append("description", data.description);
      newformData.append("onSale", data.onSale);
      newformData.append("discountPercentage", data.discountPercentage);
      newformData.append("price_before_sale", data.price_before_sale);
      newformData.append("stock", data.stock);

      // Append array values
      data.categories.forEach((category) => {
        newformData.append("categories[]", category);
      });

      data.sizes.forEach((size) => {
        newformData.append("sizes[]", size);
      });

      data.colors.forEach((color) => {
        newformData.append("colors[]", color);
      });

      data.images.forEach((image) => {
        newformData.append("images[]", image);
      });
      newformData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      try {
        await dispatch(
          updateProduct({ body: newformData, id: data.id })
        ).unwrap();
        showSuccessToast("Product updated successfully");
        setShowDrawer(false);
      } catch (ero) {
        setFormData(data);
        console.log("Error creating product:", ero);
        showErrorToast(error || ero);
      }
    }
  };
  const transformedProducts = products.map((product) => ({
    ...product,
    categories: product.categories.map((category) => category.title), // Show only titles
  }));
  return (
    <div className="admin-products">
      <Table
        columns={columns}
        data={transformedProducts}
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
      {drawerType && (
        <Drawer title={drawerType === "add" ? "Add Product" : "Edit Product"}>
          <AdminForm
            data={formData}
            formInputs={productFormInputs}
            handleCreate={drawerType === "add" ? handleCreate : handleEdit}
            validationMethod={isValidProduct}
            btnTitle={drawerType === "add" ? "Add" : "Save"}
          />
        </Drawer>
      )}
      <Toast />
    </div>
  );
};

export default AdminProducts;
