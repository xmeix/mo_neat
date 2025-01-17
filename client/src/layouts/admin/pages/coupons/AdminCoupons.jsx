import { useEffect, useState } from "react";
import "./AdminCoupons.scss";
import { useDispatch, useSelector } from "react-redux";
import AdminForm from "../../components/AdminForm/AdminForm";
import { couponFormInputs } from "../../../../assets/data/formsData"; // Update this accordingly
import Table from "../../../../components/table/Table";
import useDrawer from "../../../../utils/hooks/drawer/useDrawer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useToast from "../../../../utils/hooks/toast/useToast";
import { isSameProduct, isValidCoupon } from "../../../../utils/functions";
import {
  addCoupon,
  deleteCoupon,
  updateCoupon,
} from "../../../../store/apiCalls/coupon";

const initData = {
  name: "",
  description: "",
  code: "",
  discountPercentage: 0,
  expiryDate: new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0],
};

const columns = [
  { header: "Coupon", accessor: "name" },
  { header: "Code", accessor: "code" },
  { header: "Discount -", accessor: "discountPercentage" },
  { header: "Description", accessor: "description" },
  { header: "Expiry Date", accessor: "expiryDate" },
  { header: "Created", accessor: "createdAt" },
  { header: "Updated", accessor: "updatedAt" },
];

const AdminCoupons = () => {
  const { Drawer, setShowDrawer } = useDrawer();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();
  const [formData, setFormData] = useState(initData);
  const [drawerType, setDrawerType] = useState(null);
  const dispatch = useDispatch();
  const { coupons, loading, error, success } = useSelector(
    (state) => state.coupon
  );

  const actions = [
    {
      label: "Edit Coupon",
      icon: EditIcon,
      iconColor: "#FFC400",
      onClick: (row) => onEdit(row),
    },
    {
      special: true,
      label: "Delete Coupon",
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
      await dispatch(deleteCoupon(id));
      showSuccessToast("Coupon deleted successfully");
    } catch (ero) {
      console.log("Error deleting coupon:", ero);
      showErrorToast(error || ero);
    }
  };

  const handleCreate = async (data, e) => {
    e.preventDefault();
    try {
      await dispatch(addCoupon(data)).unwrap();
      showSuccessToast("Coupon created successfully");
      setShowDrawer(false);
    } catch (ero) {
      setFormData(data);
      console.log("Error creating coupon:", ero);
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
      try {
        await dispatch(updateCoupon({ body: data, id: data.id })).unwrap();
        showSuccessToast("Coupon created successfully");
        setShowDrawer(false);
      } catch (ero) {
        setFormData(data);
        console.log("Error creating coupon:", ero);
        showErrorToast(error || ero);
      }
    }
  };

  return (
    <div className="admin-coupons">
      <Table
        columns={columns}
        data={coupons}
        actions={{ normal: actions, toggle: [] }}
        rowsPerPage={5}
        title="Coupons Management"
        unit="coupon(s)"
        cardSections={{
          headers: ["code", "name", "description"],
          content: [],
          special: ["discountPercentage"],
          footer: ["createdAt", "updatedAt", "expiryDate"],
        }}
        banned={[
          ["id"],
          ["id", "createdAt", "updatedAt", "description", "name"],
        ]}
        onCreate={onCreate}
      />
      {drawerType && (
        <Drawer title={drawerType === "add" ? "Add Coupon" : "Edit Coupon"}>
          <AdminForm
            data={formData}
            formInputs={couponFormInputs}
            handleAction={drawerType === "add" ? handleCreate : handleEdit}
            validationMethod={isValidCoupon}
            btnTitle={drawerType === "add" ? "Add" : "Save"}
          />
        </Drawer>
      )}
      <Toast />
    </div>
  );
};

export default AdminCoupons;
