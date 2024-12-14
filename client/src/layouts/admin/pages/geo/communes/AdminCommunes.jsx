import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import useDrawer from "../../../../../utils/hooks/drawer/useDrawer";
import useToast from "../../../../../utils/hooks/toast/useToast";
import { isSameProduct, isValidCenter } from "../../../../../utils/functions";
import Table from "../../../../../components/table/Table";
import AdminForm from "../../../components/AdminForm/AdminForm";
import { centerFormInputs } from "../../../../../assets/data/formsData";
import { useNavigate } from "react-router-dom";
import {
  addCommune,
  deleteCommune,
  updateCommune,
} from "../../../../../store/apiCalls/commune";

const initData = {
  name: "",
  wilaya: "",
};

const columns = [
  { header: "Wilaya", accessor: "wilaya" },
  { header: "Name", accessor: "name" },
  { header: "Created At", accessor: "createdAt" },
  { header: "Updated At", accessor: "updatedAt" },
];

const AdminCommunes = () => {
  const { Drawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();
  const [formData, setFormData] = useState(initData);
  const [drawerType, setDrawerType] = useState(null);
  const dispatch = useDispatch();
  const { communes, loading, error, success } = useSelector(
    (state) => state.geo
  );

  const actions = [
    {
      label: "Edit Center",
      icon: EditIcon,
      iconColor: "#FFC400",
      onClick: (row) => onEdit(row),
    },
    {
      special: true,
      label: "Delete Center",
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
      await dispatch(deleteCommune(id));
      showSuccessToast("Center deleted successfully");
    } catch (ero) {
      console.log("Error deleting Center:", ero);
      showErrorToast(error || ero);
    }
  };

  const handleCreate = async (data, e) => {
    e.preventDefault();
    try {
      await dispatch(addCommune(data)).unwrap();
      showSuccessToast("Center created successfully");
      setShowDrawer(false);
    } catch (ero) {
      setFormData(data);
      console.log("Error creating Center:", ero);
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
      showInfoToast("No changes have been made to the center, yet!");
      return;
    } else {
      try {
        await dispatch(updateCommune({ body: data, id: data.id })).unwrap();
        showSuccessToast("Center created successfully");
        setShowDrawer(false);
      } catch (ero) {
        setFormData(data);
        console.log("Error creating center:", ero);
        showErrorToast(error || ero);
      }
    }
  };

  return (
    <div className="admin-centers">
      <Table
        columns={columns}
        data={communes}
        actions={actions}
        rowsPerPage={5}
        title="Centers Management"
        unit="center(s)"
        cardHeaders={["name"]}
        banned={[["id"], ["id", "createdAt", "updatedAt"]]}
        footer={["createdAt", "updatedAt"]}
        special={[]}
        onCreate={onCreate}
      />
      {drawerType && (
        <Drawer title={drawerType === "add" ? "Add Center" : "Edit Center"}>
          <AdminForm
            data={formData}
            formInputs={centerFormInputs}
            handleCreate={drawerType === "add" ? handleCreate : handleEdit}
            validationMethod={isValidCenter}
            btnTitle={drawerType === "add" ? "Add" : "Save"}
          />
        </Drawer>
      )}
      <Toast />
    </div>
  );
};

export default AdminCommunes;
