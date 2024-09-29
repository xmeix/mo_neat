import { useEffect, useState } from "react";
import "./AdminWilayas.scss";
import { useDispatch, useSelector } from "react-redux";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  addWilaya,
  deleteWilaya,
  updateWilaya,
} from "../../../../../store/apiCalls/wilaya";
import useDrawer from "../../../../../utils/hooks/drawer/useDrawer";
import useToast from "../../../../../utils/hooks/toast/useToast";
import { isSameProduct, isValidWilaya } from "../../../../../utils/functions";
import Table from "../../../../../components/table/Table";
import AdminForm from "../../../components/AdminForm/AdminForm";
import { wilayaFormInputs } from "../../../../../assets/data/formsData";

const initData = {
  name: "",
  communes: [],
  homeDeliveryFee: 0,
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Center", accessor: "communes" },
  { header: "Home delivery Fee", accessor: "homeDeliveryFee" },
  { header: "Created At", accessor: "createdAt" },
  { header: "Updated At", accessor: "updatedAt" },
];

const AdminWilayas = () => {
  const { Drawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();
  const [formData, setFormData] = useState(initData);
  const [drawerType, setDrawerType] = useState(null);
  const dispatch = useDispatch();
  const { wilayas, loading, error, success } = useSelector(
    (state) => state.wilaya
  );

  const actions = [
    {
      label: "Edit Wilaya",
      icon: EditIcon,
      iconColor: "#FFC400",
      onClick: (row) => onEdit(row),
    },
    {
      special: true,
      label: "Delete Wilaya",
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
    try {
      await dispatch(deleteWilaya(id));
      showSuccessToast("Wilaya deleted successfully");
    } catch (ero) {
      console.log("Error deleting wilaya:", ero);
      showErrorToast(error || ero);
    }
  };

  const handleCreate = async (data, e) => {
    e.preventDefault();
    try {
      await dispatch(addWilaya(data)).unwrap();
      showSuccessToast("Wilaya created successfully");
      setShowDrawer(false);
    } catch (ero) {
      setFormData(data);
      console.log("Error creating wilaya:", ero);
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
      showInfoToast("No changes have been made to the wilaya, yet!");
      return;
    } else {
      try {
        await dispatch(updateWilaya({ body: data, id: data.id })).unwrap();
        showSuccessToast("Wilaya created successfully");
        setShowDrawer(false);
      } catch (ero) {
        setFormData(data);
        console.log("Error creating coupon:", ero);
        showErrorToast(error || ero);
      }
    }
  };

  return (
    <div className="admin-wilayas">
      <Table
        columns={columns}
        data={wilayas}
        actions={actions}
        rowsPerPage={5}
        title="Wilayas Management"
        unit="wilaya(s)"
        cardHeaders={["name"]}
        banned={[["id"], ["id", "createdAt", "updatedAt"]]}
        footer={["createdAt", "updatedAt"]}
        special={[]}
        onCreate={onCreate}
      />
      {drawerType && (
        <Drawer title={drawerType === "add" ? "Add Wilaya" : "Edit Wilaya"}>
          <AdminForm
            data={formData}
            formInputs={wilayaFormInputs}
            handleCreate={drawerType === "add" ? handleCreate : handleEdit}
            validationMethod={isValidWilaya}
            btnTitle={drawerType === "add" ? "Add" : "Save"}
          />
        </Drawer>
      )}
      <Toast />
    </div>
  );
};

export default AdminWilayas;
