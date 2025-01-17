import { useCallback, useState } from "react";
import { read, utils } from "xlsx";

export const useUpload = () => {
  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = useCallback((e) => {
    let file = e.target.files[0];
    if (!file || !/\.(xlsx|xls|csv)$/i.test(file.name)) {
      alert("Please select a valid Excel or CSV file.");
      setFileName("");
      return;
    }

    setFileName(file.name);
    //e.target.value = "";
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const newJsonData = utils.sheet_to_json(worksheet, { header: 1 });

        setJsonData(newJsonData);
      } catch (error) {
        console.log("Error processing the file. Please try again.", error);
        setFileName("");
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const clearData = () => {
    setJsonData(null);
  };

  return { jsonData, handleFileChange, clearData, fileName };
};
