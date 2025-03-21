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
import {
  resetFormData,
  setDrawerType,
  setFormData,
} from "../../../../store/slices/productSlice";

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
  { header: "Created", accessor: "createdAt" },
  { header: "Updated", accessor: "updatedAt" },
];

const AdminProducts = () => {
  const { Drawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();

  const dispatch = useDispatch();
  const { products, loading, error, success, formData, drawerType } =
    useSelector((state) => state.product);

  const toggleActions = [
    {
      special: true,
      label: "Disable Product",
      iconColor: "#00BFA6",
      iconSize: "30px",
      onClick: (row) => handleActivation(row),
    },
    {
      special: true,
      label: "Activate Product",
      iconColor: "#99999",
      iconSize: "30px",
      onClick: (row) => handleActivation(row),
    },
  ];
  const actions = [
    {
      label: "View Product",
      icon: VisibilityIcon,
      iconColor: "#00BFA6",
      onClick: (row) => {
        console.log("View Product", row);
      },

      iconSize: "20px",
    },
    {
      label: "Edit Product",
      icon: EditIcon,
      iconColor: "#FFC400",
      onClick: (row) => onEdit(row),
      iconSize: "20px",
    },
    {
      special: true,
      label: "Delete Product",
      icon: DeleteIcon,
      iconColor: "#FF5252",
      iconSize: "20px",

      onClick: (row) => handleDelete(row.id),
    },
  ];

  const handleActivation = async (row) => {
    try {
      await dispatch(
        updateProduct({
          body: { enabled: row.enabled ? false : true },
          id: row.id,
        })
      ).unwrap();
      showSuccessToast("Product updated successfully");
    } catch (ero) {
      console.log("Error updating product:", ero);
      showErrorToast(error || ero);
    }
  };
  const onCreate = () => {
    dispatch(resetFormData());
    setShowDrawer(true);
    dispatch(setDrawerType("add"));
  };

  const handleDelete = async (id) => {
    console.log("Delete Product", id);
    try {
      await dispatch(deleteProduct(id));
      showSuccessToast("Product deleted successfully");
    } catch (ero) {
      console.log("Error deleting product:", ero);
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
      dispatch(setFormData(data));

      console.log("Error creating product:", ero);
      showErrorToast(error || ero);
    }
  };

  const onEdit = (row) => {
    dispatch(setDrawerType("edit"));
    setShowDrawer(true);
    dispatch(setFormData(row));
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
        dispatch(setFormData(data));
        console.log("Error updating product:", ero);
        showErrorToast(error || ero);
      }
    }
  };

  const transformedProducts = products
    .map((product) => ({
      ...product,
      categories: product.categories.map((category) => category.title), // Show only titles
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="admin-products">
      <Table
        columns={columns}
        data={transformedProducts}
        actions={{ normal: actions, toggle: toggleActions }}
        rowsPerPage={5}
        title="Product Management"
        unit="product(s)"
        cardSections={{
          headers: ["title", "description"],
          content: ["price_before_sale"],
          special: ["onSale"],
          footer: ["createdAt", "updatedAt"],
        }}
        banned={[
          [],
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
        onCreate={onCreate}
      />
      {drawerType && (
        <Drawer
          title={
            drawerType === "add"
              ? "Create New Product"
              : "Update Product Details"
          }
        >
          <AdminForm
            data={formData}
            inputs={productFormInputs}
            handleAction={drawerType === "add" ? handleCreate : handleEdit}
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
