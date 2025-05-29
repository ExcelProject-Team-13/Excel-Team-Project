import React, { useRef } from "react";
import * as XLSX from "xlsx";
import "./page.css";

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

        // Validate structure
        const validationResult = validateStructure(dataArray);

        if (validationResult.isValid) {
          const transformedData = transformToSingleSeries(dataArray, validationResult);

          onData({
            isValid: true,
            title: file.name.replace(/\.[^/.]+$/, ""),
            data: transformedData,
            headers: validationResult.headers,
            format: validationResult.format
          });
        } else {
          onData({
            isValid: false,
            title: file.name,
            data: []
          });
        }
      } catch (error) {
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

  function validateStructure(dataArray) {
    if (!dataArray || dataArray.length < 2) {
      return { isValid: false };
    }

    // First try to validate as horizontal format
    const horizontalCheck = checkHorizontalFormat(dataArray);
    if (horizontalCheck.isValid) {
      return horizontalCheck;
    }

    // If not horizontal, try vertical format
    const verticalCheck = checkVerticalFormat(dataArray);
    if (verticalCheck.isValid) {
      return verticalCheck;
    }

    // If neither format matches
    return {
      isValid: false,
      headers: []
    };
  }
  function checkHorizontalFormat(dataArray) {
    // Must have exactly 2 rows (header + values)
    if (dataArray[2].length > 0 || dataArray.length < 2) {
      return { isValid: false };
    }
    console.log(dataArray)
    dataArray = dataArray.slice(0, 2); // Only consider first 2 rows
    const [row1, row2] = dataArray;
    let check1 = row1.slice(1,)
    let check2 = row2.slice(1,)
    //below conditions checks if the check1 is all string then check2 is all number and viceversa
    if (check1.every(item => typeof item === 'string') &&
      check2.every(item => typeof item === 'number')) {
      return {
        isValid: true,
        headers: [row1[0], row2[0]], // Skip first column if it's a label
        format: "horizontal"
      };

    } else if (check1.every(item => typeof item === 'number') &&
      check2.every(item => typeof item === 'string')) {
      return {
        isValid: true,
        headers: [row2[0], row1[0]], // Skip first column if it's a label
        format: "horizontal"
      };

    } else {
      return { isValid: false };
    }

  }
  function checkVerticalFormat(dataArray) {
    // Must have at least 2 columns
    console.log(dataArray)
    if (dataArray[0].length != 2) {
      return { isValid: false };
    }

    const [headerRow, ...dataRows] = dataArray;

    // Check we have two header columns
    if (headerRow.length < 2 ||
      typeof headerRow[0] !== 'string' ||
      typeof headerRow[1] !== 'string') {
      return { isValid: false };
    }

    // Check all data rows have two columns with correct types
    const isValid = dataRows.every(row =>
      row.length >= 2 &&
      typeof row[0] === "string" &&
      typeof row[1] === "number"
    );

    if (isValid) {
      return {
        isValid: true,
        headers: [headerRow[0], headerRow[1]],
        format: "vertical"
      };
    }

    return { isValid: false };
  }
  function transformToSingleSeries(dataArray, validationResult) {
    if (validationResult.format === "horizontal") {
      const [headerRow, valueRow] = dataArray;
      const [labelHeader, valueHeader] = validationResult.headers;

      // Skip the first column if it's a label (like "day" in your example)
      const startIndex = 1;

      return headerRow.slice(startIndex).map((category, i) => ({
        [labelHeader]: category,                // e.g., "day": "mon"
        [valueHeader]: valueRow[i + startIndex]  // e.g., "value": 22
      }));
    }
    else { // vertical format
      const [headerRow, ...dataRows] = dataArray;
      return dataRows.map(row => ({
        [headerRow[0]]: row[0], // First column becomes dynamic property
        [headerRow[1]]: row[1]  // Second column becomes dynamic property
      }));
    }
  }


  return (
    <button className="container-btn-file w-[170px]">
      <Image src="./excel.png" alt="excel-icon" />
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