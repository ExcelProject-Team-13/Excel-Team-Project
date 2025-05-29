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

                const validationResult = validatePointData(dataArray);

                if (validationResult.isValid) {
                    const transformedData = transformPointData(dataArray);

                    onData({
                        isValid: true,
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        data: transformedData,
                        headers: validationResult.headers,
                        format: "point-data"
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

    function validatePointData(dataArray) {
        if (!dataArray || dataArray.length < 2) {
            return { isValid: false };
        }

        const headers = dataArray[0].map(h => h ? h.toString().trim() : '');

        // Check if we have at least 3 numeric columns (for x, y, radius)
        if (headers.length < 3) return { isValid: false };

        return {
            isValid: true,
            headers: headers,
            format: "point-data"
        };
    }

    function transformPointData(dataArray) {
        const [headers, ...rows] = dataArray;
        const lowerHeaders = headers.map(h => h ? h.toString().trim().toLowerCase() : '');

        const labelIndex = lowerHeaders.findIndex(h => h.includes('label')) >= 0 ?
            lowerHeaders.findIndex(h => h.includes('label')) : -1;

        const xIndex = lowerHeaders.findIndex(h => h.includes('x')) >= 0 ?
            lowerHeaders.findIndex(h => h.includes('x')) :
            findFirstNumericColumn(rows);
        const yIndex = xIndex !== -1 ? findFirstNumericColumn(rows, xIndex + 1) : -1;
        const radiusIndex = yIndex !== -1 ? findFirstNumericColumn(rows, yIndex + 1) : -1;

        return rows.map((row, i) => {
            // Label fallback logic
            let label = `Point ${String.fromCharCode(65 + i)}`;
            if (
                labelIndex !== -1 &&
                typeof row[labelIndex] !== "undefined" &&
                row[labelIndex] !== null &&
                row[labelIndex].toString().trim() !== ""
            ) {
                label = row[labelIndex].toString().trim();
            }

            return {
                label,
                x: Number(row[xIndex]) || 0,
                y: Number(row[yIndex]) || 0,
                radius: Number(row[radiusIndex]) || 0
            };
        });
    }

    function findFirstNumericColumn(rows, startFrom = 0) {
        for (let col = startFrom; col < rows[0]?.length; col++) {
            if (rows.some(row => !isNaN(parseFloat(row[col])))) {
                return col;
            }
        }
        return -1;
    }


    return (
        <button className="container-btn-file w-[170px]">
            <svg
                fill="#fff"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 50 50"
            >
                <path
                    d="M28.8125 .03125L.8125 5.34375C.339844 
    5.433594 0 5.863281 0 6.34375L0 43.65625C0 
    44.136719 .339844 44.566406 .8125 44.65625L28.8125 
    49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 
    50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 
    30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 
    .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 
    6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 
    29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 
    43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 
    13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 
    21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 
    22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 
    15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 
    28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 
    27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 
    14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 
    20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z"
                ></path>
            </svg>
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