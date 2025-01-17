import { useCallback, useState } from "react";
import "./ImportExport.scss";
import { useUpload } from "../../../../../utils/hooks/files/useUpload";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../../../../utils/hooks/toast/useToast";
const ImportExport = () => {
  const { jsonData, handleFileChange, clearData, fileName } = useUpload();
  const { Toast, showErrorToast, showSuccessToast, showInfoToast } = useToast();
  const dispatch = useDispatch();
  const { coupons, loading, error, success } = useSelector(
    (state) => state.coupon
  );
  const pushDataToDB = () => {
    console.log("jsonData");
    console.log(jsonData);
  };

  const pushPerBatch = async (data, e) => {
    e.preventDefault();
    try {
      
        await dispatch().unwrap();

      showSuccessToast("Data Was Pushed successfully");
    } catch (ero) {
      console.log("Error creating coupon:", ero);
      showErrorToast(error || ero);
    }
  };

  return (
    <div className="import-export">
      <input type="file" className="upload-input" onChange={handleFileChange} />
      <button className="upload-btn" onClick={pushDataToDB}>
        Insert Data
      </button>
      <Toast />
    </div>
  );
};

export default ImportExport;
