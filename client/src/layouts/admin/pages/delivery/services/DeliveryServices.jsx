import "./DeliveryServices.scss";
import { useDispatch, useSelector } from "react-redux";
import useDrawer from "../../../../../utils/hooks/drawer/useDrawer";
import useToast from "../../../../../utils/hooks/toast/useToast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

const DeliveryServices = () => {
  const { Drawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();

  const dispatch = useDispatch();
  const { deliveryServices, loading, error, success, formData, drawerType } =
    useSelector((state) => state.deliveryService);

  const toggleActions = [
    {
      special: true,
      label: "Activate service",
      iconColor: "#00BFA6",
      iconSize: "30px",
      onClick: (row) => handleActivation(row),
    },
    {
      special: true,
      label: "Deactivate Service",
      iconColor: "#99999",
      iconSize: "30px",
      onClick: (row) => handleActivation(row),
    },
  ];
  const actions = [
    {
      label: "View Service",
      icon: VisibilityIcon,
      iconColor: "#00BFA6",
      onClick: (row) => {
        console.log("View Service", row);
      },

      iconSize: "20px",
    },
    {
      label: "Edit Service",
      icon: EditIcon,
      iconColor: "#FFC400",
      onClick: (row) => onEdit(row),
      iconSize: "20px",
    },
    {
      special: true,
      label: "Delete Service",
      icon: DeleteIcon,
      iconColor: "#FF5252",
      iconSize: "20px",

      onClick: (row) => handleDelete(row.id),
    },
  ];

  const handleActivation = async (row) => {
  
  };
  const onCreate = () => {
    dispatch(resetFormData());
    setShowDrawer(true);
    dispatch(setDrawerType("add"));
  };

  const handleDelete = async (id) => {
    console.log("Delete Product", id);
  
  };

  const handleCreate = async (data, e) => {
    e.preventDefault();
  
  };

  const onEdit = (row) => {
    dispatch(setDrawerType("edit"));
    setShowDrawer(true);
    dispatch(setFormData(row));
  };

  const handleEdit = async (data, e) => {
    e.preventDefault();

 
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
        <Drawer title={drawerType === "add" ? "Add Product" : "Edit Product"}>
          <AdminForm
            data={formData}
            formInputs={productFormInputs}
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

export default DeliveryServices;
