import "./DeliveryServices.scss";
import { useDispatch, useSelector } from "react-redux";
import useDrawer from "../../../../../utils/hooks/drawer/useDrawer";
import useToast from "../../../../../utils/hooks/toast/useToast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  resetServiceForm,
  setServiceDrawerType,
  setServiceForm,
} from "../../../../../store/slices/deliverySlice";
import Table from "../../../../../components/table/Table";
import { serviceFormInputs } from "../../../../../assets/data/formsData";
import AdminForm from "../../../components/AdminForm/AdminForm";
import { isValidDeliveryService } from "../../../../../utils/functions";

const columns = [
  { header: "Code", accessor: "tmCode" },
  { header: "Title", accessor: "tmName" },
  { header: "Description", accessor: "tmDescription" },
  { header: "Carrier", accessor: "carrierName" },
  { header: "Created", accessor: "createdAt" },
  { header: "Updated", accessor: "updatedAt" },
];

const DeliveryServices = () => {
  const { Drawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();

  const dispatch = useDispatch();
  const {
    services,
    loading,
    error,
    success,
    serviceFormData,
    serviceDrawerType,
  } = useSelector((state) => state.delivery);

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

  const handleActivation = async (row) => {};
  const onCreate = () => {
    dispatch(resetServiceForm());
    setShowDrawer(true);
    dispatch(setServiceDrawerType("add"));
  };

  const handleDelete = async (id) => {
    console.log("Delete Product", id);
  };

  const handleCreate = async (data, e) => {
    e.preventDefault();
  };

  const onEdit = (row) => {
    dispatch(setServiceDrawerType("edit"));
    setShowDrawer(true);
    dispatch(setServiceForm(row));
  };

  const handleEdit = async (data, e) => {
    e.preventDefault();
  };

  const transformedServices = services
    .map((s) => s)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  console.log(transformedServices);
  return (
    <div className="admin-products">
      <Table
        columns={columns}
        data={transformedServices}
        actions={{ normal: actions, toggle: toggleActions }}
        rowsPerPage={5}
        title="Delivery services Management"
        unit="service(s)"
        cardSections={{
          headers: ["tmCode", "tmName", "tmDescription"],
          content: ["carrierName"],
          special: [],
          footer: ["createdAt", "updatedAt"],
        }}
        banned={[[], ["createdAt", "updatedAt", "tmDescription"]]}
        onCreate={onCreate}
      />
      {serviceDrawerType && (
        <Drawer
          title={serviceDrawerType === "add" ? "Add Service" : "Edit Service"}
        >
          <AdminForm
            data={serviceFormData}
            inputs={serviceFormInputs}
            handleAction={
              serviceDrawerType === "add" ? handleCreate : handleEdit
            }
            validationMethod={isValidDeliveryService}
            btnTitle={serviceDrawerType === "add" ? "Add" : "Save"}
          />
        </Drawer>
      )}
      <Toast />
    </div>
  );
};

export default DeliveryServices;
