import "./ShippingZones.scss";
import { useDispatch, useSelector } from "react-redux";
import useDrawer from "../../../../../utils/hooks/drawer/useDrawer";
import useToast from "../../../../../utils/hooks/toast/useToast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  resetZoneForm,
  setZoneDrawerType,
  setZoneForm,
} from "../../../../../store/slices/deliverySlice";
import Table from "../../../../../components/table/Table";
import AdminForm from "../../../components/AdminForm/AdminForm";
import { isValidDeliveryService } from "../../../../../utils/functions";
import { zoneFormInputs } from "../../../../../assets/data/formsData";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Address", accessor: "address" },
  {
    header: "Region",
    accessor: "commune",
    children: [
      { header: "name", accessor: "name" },
      { header: "postalCode", accessor: "postalCode" },
      {
        header: "wilaya",
        accessor: "wilaya",
        children: [{ header: "name", accessor: "name" }],
      },
    ],
  },
  {
    header: "Delivery Service",
    accessor: "deliveryService",
    children: [{ header: "tmCode", accessor: "tmCode" }],
  },
  { header: "Delivery Fee - DZ", accessor: "deliveryFee" },
  { header: "Created", accessor: "createdAt" },
  { header: "Updated", accessor: "updatedAt" },
];

const ShippingZones = () => {
  const { Drawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();

  const dispatch = useDispatch();
  const { zones, loading, error, success, zoneFormData, zoneDrawerType } =
    useSelector((state) => state.delivery);

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
    dispatch(resetZoneForm());
    setShowDrawer(true);
    dispatch(setZoneDrawerType("add"));
  };

  const handleDelete = async (id) => {
    console.log("Delete Product", id);
  };

  const handleCreate = async (data, e) => {
    e.preventDefault();
  };

  const onEdit = (row) => {
    dispatch(setZoneDrawerType("edit"));
    setShowDrawer(true);
    dispatch(setZoneForm(row));
  };

  const handleEdit = async (data, e) => {
    e.preventDefault();
  };

  const transformedZones = zones
    ?.map((s) => s)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="admin-products">
      <Table
        columns={columns}
        data={transformedZones}
        actions={{ normal: actions, toggle: toggleActions }}
        rowsPerPage={5}
        title="Shipping zones Management"
        unit="zone(s)"
        cardSections={{
          headers: [
            "name",
            "address",
            "deliveryService.tmCode",
            "commune.name",
            "commune.wilaya.name",
          ],
          content: ["deliveryFee"],
          special: [],
          footer: ["createdAt", "updatedAt"],
        }}
        banned={[[], ["commune", "deliveryService"]]}
        onCreate={onCreate}
      />
      {zoneDrawerType && (
        <Drawer
          title={
            zoneDrawerType === "add"
              ? "Create new shipping zone"
              : "Edit shipping zone"
          }
        >
          <AdminForm
            data={zoneFormData}
            inputs={zoneFormInputs}
            handleAction={zoneDrawerType === "add" ? handleCreate : handleEdit}
            validationMethod={isValidDeliveryService}
            btnTitle={zoneDrawerType === "add" ? "Add" : "Save"}
          />
        </Drawer>
      )}
      <Toast />
    </div>
  );
};

export default ShippingZones;
