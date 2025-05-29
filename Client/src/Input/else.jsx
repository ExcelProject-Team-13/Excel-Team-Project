import React, { useRef } from "react";
import * as XLSX from "xlsx";
import "./page.css"

const ExcelReader = ({ onData }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const dataArray = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const validationResult = validateHorizontalTable(dataArray);

        if (validationResult.isValid) {
          const transformedData = transformHorizontalTable(dataArray);

          onData({
            isValid: true,
            title: file.name.replace(/\.[^/.]+$/, ""),
            data: transformedData,
            headers: validationResult.headers,
            products: validationResult.products,
            format: "horizontal-table"
          });
        } else {
          onData({
            isValid: false,
            title: file.name,
            data: []
          });
        }
      } catch (error) {
        console.error("Error processing file:", error);
        onData({
          isValid: false,
          title: file.name,
          data: []
        });
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  function validateHorizontalTable(dataArray) {
    if (!dataArray || dataArray.length < 2) {
      return { isValid: false };
    }

    const headers = dataArray[0];
    if (!headers || headers.length < 2) {
      return { isValid: false };
    }

    // First column should be categories (strings)
    // Subsequent columns should be numeric values
    const isValid = dataArray.slice(1).every(row => {
      if (!row || row.length < headers.length) return false;

      // First column should be string (category)
      if (typeof row[0] !== 'string') return false;

      // All other columns should be numbers
      return row.slice(1).every((cell, i) => {
        // Allow empty cells or numbers
        return cell === null || cell === '' || typeof cell === 'number';
      });
    });

    if (isValid) {
      return {
        isValid: true,
        headers: headers[0], // "Category"
        products: headers.slice(1), // ["Product A", "Product B", "Product C"]
        format: "horizontal-table"
      };
    }

    return { isValid: false };
  }

  function transformHorizontalTable(dataArray) {
    console.log(dataArray)
    const [headers, ...rows] = dataArray;
    console.log(headers)
    const products = headers.slice(1); // ["Product A", "Product B", "Product C"]

    return rows.map(row => {
      const Category = row[0];
      const values = row.slice(1);

      const productData = {};
      products.forEach((product, i) => {
        productData[product] = values[i] || 0; // Default to 0 if empty
      });

      return {
        Category,
        ...productData
      };
    });
  }


  return (
    <button className="container-btn-file w-[170px]">
      <img src="./excel.png" alt="excel-icon" />

      Upload File
      <input
        ref={fileInputRef}
        className="file"
        onChange={handleFileUpload}
        name="text"
        accept=".xlsx,.xls,.csv"
        type="file"
      />
    </button>
  );
};

export default ExcelReader;